const userIDAuth = require("../middleware/userIDAuth");
const router = require("express").Router();
const announcementControllers = require("../controllers/announcements");

router.post("/new", userIDAuth({ authorizationOnlyTo: "Teacher" }), (req, res) => {
  let { announcementBody, classroomId } = req.body;
  let masterUserId = req.userData.userID;

  announcementControllers
    .createAnnouncement(announcementBody, classroomId, masterUserId)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(422).send(error);
    });
});

router.get("/", userIDAuth(), (req, res) => {
  let classroomId = req.query.classroomId;

  announcementControllers
    .getAnnouncements(classroomId)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(422).send(error);
    });
});

module.exports = router;
