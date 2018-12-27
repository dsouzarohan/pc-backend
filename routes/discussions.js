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

router.post("/discussionPost/create", userAuth(), (req, res) => {
  let { discussionId, body } = req.body;
  let userId = req.userData.userID;

  discussionController
    .createDiscussionPost({
      discussionId,
      userId,
      body
    })
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.json(error);
    });
});

router.post("/discussionPost/discussionPostComment/create", userAuth(), (req, res) => {
  let { discussionPostId, body } = req.body;
  let userId = req.userData.userID;

  discussionController
    .createDiscussionPostComment({
      userId,
      discussionPostId,
      body
    })
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//get discussions

router.get("/all/:classroomId", userAuth(), (req, res) => {
  let classroomId = req.params.classroomId;

  discussionController
    .getAllDiscussions(classroomId)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.json(error);
    });
});

router.get("/:discussionId", userAuth(), (req, res) => {
  let discussionId = req.params.discussionId;

  discussionController
    .getDiscussion(discussionId)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.json(error);
    });
});

module.exports = router;
