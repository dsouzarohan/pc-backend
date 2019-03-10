const {
  sequelize,
  Sequelize,
  upload,
  file,
  masterUser,
  classroom,
  masterUserPersonal
} = require("../models");

const archiver = require("archiver");
const mime = require("mime-types");
const s3Fetcher = require("../utilities/s3-fetcher");

const getUploads = classroomId => {
  return new Promise((resolve, reject) => {
    classroom
      .findOne({
        where: {
          id: classroomId
        }
      })
      .then(fetchedClassroom => {
        if (!fetchedClassroom) {
          reject({
            message: "Classroom whose uploads are to be fetched does not exist"
          });
        } else {
          return upload.findAll({
            where: {
              classroomId: fetchedClassroom.id
            },
            include: [
              {
                model: file,
                as: "files"
              },
              {
                model: masterUser,
                as: "uploader",
                attributes: ["id", "typeOfUser"],
                include: [
                  {
                    model: masterUserPersonal,
                    as: "personalDetails",
                    attributes: ["id", "firstName", "lastName"]
                  }
                ]
              }
            ]
          });
        }
      })
      .then(fetchedUploads => {
        resolve({
          message: "Uploads are fetched successfully",
          data: fetchedUploads
        });
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

const createUpload = (classroomId, title, body, uploadId, uploaderId) => {
  return new Promise((resolve, reject) => {
    classroom
      .findOne({
        where: {
          id: classroomId
        }
      })
      .then(fetchedClassroom => {
        if (!fetchedClassroom) {
          reject({
            message:
              "Classroom in which files are to be uploaded does not exist"
          });
        } else {
          return fetchedClassroom.createUpload({
            title: title,
            body: body,
            id: uploadId,
            uploaderId: uploaderId
          });
        }
      })
      .then(createdUpload => {
        return upload.findOne({
          where: {
            id: createdUpload.id
          },
          include: [
            {
              model: masterUser,
              as: "uploader",
              attributes: ["id", "typeOfUser"],
              include: [
                {
                  model: masterUserPersonal,
                  as: "personalDetails",
                  attributes: ["id", "firstName", "lastName"]
                }
              ]
            }
          ]
        });
      })
      .then(createdUpload => {
        resolve({
          message: "Upload created successfully",
          data: createdUpload
        });
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

const addFilesToUpload = (classroomId, uploadId, files) => {
  console.log("@NotesController#FilesToUpload", files);

  let filesToCreate = [];

  console.log("@NotesController#CreateUpload#Files", files);
  for (let i = 0; i < files.length; i++) {
    filesToCreate.push({
      originalName: files[i].originalname,
      size: files[i].size,
      key: files[i].key,
      uploadId: uploadId
    });
  }

  console.log("@NotesController#CreateUpload#FilesToCreate", filesToCreate);

  return new Promise((resolve, reject) => {
    file
      .bulkCreate(filesToCreate)
      .then(() => {
        return upload.findOne({
          where: {
            id: uploadId
          },
          include: [
            {
              model: file,
              as: "files"
            },
            {
              model: masterUser,
              as: "uploader",
              attributes: ["id", "typeOfUser"],
              include: [
                {
                  model: masterUserPersonal,
                  as: "personalDetails",
                  attributes: ["id", "firstName", "lastName"]
                }
              ]
            }
          ]
        });
      })
      .then(createdUpload => {
        if (!createdUpload) {
          reject({
            message: "Uploads could not be created"
          });
        } else {
          resolve({
            message: "Files uploaded successfully",
            data: createdUpload
          });
        }
      })
      .catch(error => {
        reject({
          message: "Something went wrong" + error.toString()
        });
      });
  });
};

const download = (req, res) => {
  let uploadId = req.query.uploadId;
  upload
    .findOne({
      where: {
        id: uploadId
      },
      include: [
        {
          model: file,
          as: "files"
        }
      ]
    })
    .then(fetchedUpload => {
      if (!fetchedUpload) {
        res.status(422).send({
          message: "Upload does not exist"
        });
      } else {
        let zipName = fetchedUpload.title.split(" ").join("-") + ".zip";
        res.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-disposition": "attachment; filename=" + zipName
        });
        let fetchedUploadFiles = fetchedUpload.files;
        let archive = archiver("zip", {
          zlib: { level: 9 }
        });

        archive.pipe(res);

        s3Fetcher.getS3ObjectsAsBufferArray(fetchedUploadFiles).then(result => {
          let bufferArray = result.bufferArray;
          console.log("Buffer array with name", bufferArray);

          for (let i = 0; i < bufferArray.length; i++) {
            console.log("Appending " + bufferArray[i].originalName + "...");
            archive.append(bufferArray[i].buffer, {
              name: bufferArray[i].originalName
            });
          }

          console.log("Finalizing...");
          archive.finalize();
        });
      }
    })
    .catch(error => {
      res.status(422).send({
        message: "Something went wrong - " + error.toString()
      });
    });
};

const downloadFile = (req, res) => {
  let fileId = req.query["fileId"];

  let downloadedFile;

  file
    .findOne({
      where: {
        id: fileId
      }
    })
    .then(fetchedFile => {
      if (fetchedFile) {
        downloadedFile = fetchedFile;
        return s3Fetcher.getS3Object(fetchedFile.key);
      } else {
        console.log("File to be downloaded does not exist");

        res.status(422).send({
          message: "File to be downloaded does not exist"
        });

        return null;
      }
    })
    .then(fileObject => {
      if (fileObject) {
        res.set({
          "Content-Type": mime.contentType(downloadedFile.originalName),
          "Content-disposition":
            "attachment; filename=" + downloadedFile.originalName
        });

        console.log("Testing");

        res.end(fileObject.Body);

      } else {
        throw new Error("File could not be downloaded");
      }
    })
    .catch(error => {
      console.log("Some error", error);

      res.status(422).send({
        message: "Something went wrong - " + error.toString()
      });
    });
};

module.exports = {
  addFilesToUpload,
  createUpload,
  getUploads,
  download,
  downloadFile
};
