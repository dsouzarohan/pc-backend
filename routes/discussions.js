const express = require("express");
const router = express.Router();

const userAuth = require("../middleware/userIDAuth");

const discussionController = require("../controllers/discussions");

//create discussion, discussion post, discussion post comments

router.post("/create", userAuth(), (req, res) => {
  let discussionTopic = req.body.discussionTopic;
  let discussionBody = req.body.discussionBody;
  let classroomId = req.body.classroomId;

  let userId = req.userData.userID;

  let discussionDetails = {
    discussionTopic,
    discussionBody,
    classroomId,
    userId
  };

  discussionController
    .createDiscussion(discussionDetails)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.json({
        success: false,
        message: error
      });
    });
});

router.post("/discussionPost/create");

router.post("/discussionPost/discussionPostComment/create");

module.exports = router;
