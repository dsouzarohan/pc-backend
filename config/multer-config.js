const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("./aws-s3-config");
const mime = require("mime-types");

const BUCKET_NAME = "pc-notes";
const CLASSROOM_FOLDER_PREFIX = "pc-classroom-";
const UPLOAD_FOLDER_PREFIX = "pc-upload-";
const BUCKET_REGION = "us-east-1";

//for testing only
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "notes-storage");
  },
  filename: (req, file, callback) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    console.log("@FileNameCB", file);
    console.log("@MutlerConfiger", file.mimetype);
    const extension = mime.extension(mime.lookup(file.originalname));
    callback(null, name + "-" + Date.now() + "." + extension);
  }
});

const multerStorage = multerS3({
  s3: s3,
  bucket: "pc-notes",
  metadata: (req, file, callback) => {

    console.log(file);

    callback(null, {fieldName: file.fieldname})
  },
  key: (req, file, callback) => {

    let classroomId = "pc-classroom#"+req.body.classroomId;
    let uploadId = "pc-upload#"+req.uploadInfo.uploadId;

    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    callback(null, classroomId+"/"+
        uploadId+"/"+
        Date.now().toString()+"$"+fileName);
  }
});

module.exports = {
  storage,
  multer,
  multerStorage,
  BUCKET_NAME,
  BUCKET_REGION,
  CLASSROOM_FOLDER_PREFIX,
  UPLOAD_FOLDER_PREFIX
};
