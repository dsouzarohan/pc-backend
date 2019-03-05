const router = require("express").Router();
const userAuth = require("../middleware/userIDAuth");
const {
  multer,
  storage,
  multerStorage,
  UPLOAD_FOLDER_PREFIX,
  CLASSROOM_FOLDER_PREFIX
} = require("../config/multer-config");
const uuidv4 = require("uuid/v4");
const zipper = require("../config/zipper-config");

const notesController = require("../controllers/notes");

const upload = multer({
  storage: multerStorage
});

const multipleUploads = upload.array("fileUploads", 10);

router.post("/upload", userAuth(), (req, res) => {
  req.uploadInfo = {
    uploadId: uuidv4()
  };

  multipleUploads(req, res, (err, data) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong - " + err.toString() });
    } else {
      let { classroomId, title, body } = req.body;

      let uploadId = req.uploadInfo.uploadId;
      let uploaderId = req.userData.userID;
      let files = req.files;

      console.log("@NotesRoutes#UploadedFiles", req.files, req.uploadInfo);
      notesController
        .createUpload(classroomId, title, body, uploadId, uploaderId)
        .then(createdUploadResult => {
          console.log(
            "#CreatedUpload",
            createdUploadResult.data.classroomId,
            createdUploadResult.data.id
          );

          return notesController.addFilesToUpload(
            createdUploadResult.data.classroomId,
            createdUploadResult.data.id,
            files
          );
        })
        .then(finalUploadResult => res.json(finalUploadResult))
        .catch(error => res.status(422).send(error));
    }
  });
});

router.get("/", userAuth(), (req, res) => {
  let classroomId = req.query.classroomId;

  notesController
    .getUploads(classroomId)
    .then(result => res.json(result))
    .catch(error => res.status(422).send(error));
});

router.get("/download", userAuth(), (req, res) => {
  let uploadId = req.query.uploadId;

  console.log("Route reached", uploadId);
  console.log("ziipper", zipper.awsConfig);

  notesController
    .download(req, res);
    // .then(result => {
    //
    //   console.log(result);
    //
    //   // res.download(result.zipLocation);
    // })
    // .catch(error => {
    //   console.log("error" + error);
    // });
});

module.exports = router;
