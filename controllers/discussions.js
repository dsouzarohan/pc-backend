const {
  Sequelize,
  sequelize,

  Discussion,
  DiscussionPost,
  DiscussionPostComment,
  Classroom
} = require("../models");

//create controllers

const createDiscussion = discussionDetails => {
  return new Promise((resolve, reject) => {
    let topic = discussionDetails.discussionTopic;
    let body = discussionDetails.discussionBody;
    let classroomId = discussionDetails.classroomId;
    let userId = discussionDetails.userId;

    Classroom.findOne({
      where: {
        id: classroomId
      }
    })
      .then(classroom => {
        if (!classroom) {
          reject({
            success: false,
            message:
              "Classroom in which discussion is to be created does not exist"
          });
        }

        return classroom.createDiscussion({
          topic,
          body,
          startedBy: userId
        });
      })
      .then(discussion => {
        if (discussion) {
          resolve({
            success: true,
            message: "Discussion created"
          });
        } else {
          reject({
            success: false,
            message: "Discussion not created"
          });
        }
      })
      .catch(error => {
        reject({
          success: false,
          message: error
        });
      });
  });
};

const createDiscussionPost = discussionPostDetails => {
  return new Promise((resolve, reject) => {
    let { discussionId, userId, body } = discussionPostDetails;

    Discussion.findOne({
      where: {
        id: discussionId
      }
    })
      .then(discussion => {
        if (!discussion) {
          reject({
            success: false,
            message: "Discussion on which post is to be created does not exist"
          });
        }

        return discussion.createDiscussionPost({
          body,
          postedBy: userId
        });
      })
      .then(discussionPost => {
        if (discussionPost) {
          resolve({
            success: true,
            message: "Discussion post created"
          });
        }
      })
      .catch(error => {
        reject({
          success: false,
          error
        });
      });
  });
};

const createDiscussionPostComment = discussionPostCommentDetails => {
  return new Promise((resolve, reject) => {
    let { userId, discussionPostId, body } = discussionPostCommentDetails;

    DiscussionPost.findOne({
      where: {
        id: discussionPostId
      }
    })
      .then(discussionPost => {
        if (!discussionPost) {
          reject({
            success: false,
            error:
              "Discussion post on which comment is to be created does not exist"
          });
        }

        return discussionPost.createDiscussionPostComment({
          body,
          commentedBy: userId
        });
      })
      .then(discussionPostComment => {
        if (discussionPostComment) {
          resolve({
            success: true,
            message: "Discussion Post Comment created"
          });
        } else {
          reject({
            success: false,
            error: "Comment could not be created"
          });
        }
      })
      .catch(error => {
        reject({
          success: false,
          error
        });
      });
  });
};

//read controllers

const getAllDiscussions = classroomId => {
  return new Promise((resolve, reject) => {
    Discussion.findAll({
      where: {
        classroomId
      }
    })
      .then(discussions => {
        resolve({
          success: true,
          message: "Discussions retrieved",
          data: discussions
        });
      })
      .catch(error => {
        console.log(error);

        reject({
          success: false,
          error
        });
      });
  });
};

const getDiscussion = discussionId => {
  return new Promise((resolve, reject) => {
    Discussion.findOne({
      where: {
        id: discussionId
      },
      include: [
        {
          model: DiscussionPost,
          include: [
            {
              model: DiscussionPostComment
            }
          ]
        }
      ]
    })
      .then(discussion => {
        resolve({
          success: true,
          message: "Discussion fetched",
          data: discussion
        });
      })
      .catch(error => {
        reject({
          success: false,
          error
        });
      });
  });
};

module.exports = {
  createDiscussion,
  createDiscussionPost,
  createDiscussionPostComment,

  getAllDiscussions,
  getDiscussion
};
