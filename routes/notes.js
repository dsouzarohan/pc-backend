const router = require("express").Router();
const userAuth = require("../middleware/userIDAuth");
const {
  multer,
  multerStorage
} = require("../config/multer-config");
const uuidv4 = require("uuid/v4");

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
      classroomId = +classroomId;

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
  notesController.download(req, res);
});

router.get("/download/file", userAuth(), (req, res) => {
  notesController.downloadFile(req, res);
});

module.exports = router;