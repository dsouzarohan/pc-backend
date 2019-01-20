const {
  Sequelize,
  sequelize,

  Discussion,
  DiscussionPost,
  DiscussionPostComment,
  Classroom,
  MasterUser,
  MasterUserPersonal
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
            message: "Discussion created"
          });
        } else {
          reject({
            message: "Discussion not created"
          });
        }
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
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
          return DiscussionPost.findOne({
            where: {
              id: discussionPost.id
            },
            include: [
              {
                model: MasterUser,
                attributes: ["id", "typeOfUser"],
                include: [
                  {
                    model: MasterUserPersonal,
                    attributes: ["id", "firstName", "lastName"]
                  }
                ]
              }
            ]
          });
        }
      })
      .then(discussionPost => {
        if (discussionPost) {
          resolve({
            message: "Discussion post created",
            discussionPost
          });
        }
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
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
            message:
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
          // resolve({
          //   message: "Discussion Post Comment created"
          // });

          return DiscussionPostComment.findOne({
            where: {
              id: discussionPostComment.id
            },
            include: [
              {
                model: MasterUser,
                attributes: ["id", "typeOfUser"],
                include: [
                  {
                    model: MasterUserPersonal,
                    attributes: ["id", "firstName", "lastName"]
                  }
                ]
              }
            ]
          });
        } else {
          reject({
            message: "Comment could not be created"
          });
        }
      })
      .then(createdDiscussionPostComment => {
        resolve({
          message: "Discussion post comment created successfully",
          discussionComment: createdDiscussionPostComment
        });
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
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
      },
      include: [
        {
          model: MasterUser,
          attributes: ["id", "typeOfUser"],
          include: [
            {
              model: MasterUserPersonal,
              attributes: ["id", "firstName", "lastName"]
            }
          ]
        }
      ]
    })
      .then(discussions => {
        resolve({
          message: "Discussions retrieved",
          data: discussions
        });
      })
      .catch(error => {
        console.log(error);

        reject({
          message: "Something went wrong - " + error.toString()
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
      order: [[DiscussionPost, "createdAt", "DESC"],[DiscussionPost, DiscussionPostComment, "createdAt", "DESC"]],
      include: [
        {
          model: MasterUser,
          attributes: ["id", "typeOfUser"],
          include: [
            {
              model: MasterUserPersonal,
              attributes: ["id", "firstName", "lastName"]
            }
          ]
        },
        {
          model: DiscussionPost,
          include: [
            {
              model: MasterUser,
              attributes: ["id", "typeOfUser"],
              include: [
                {
                  model: MasterUserPersonal,
                  attributes: ["id", "firstName", "lastName"]
                }
              ]
            },
            {
              model: DiscussionPostComment,
              include: [
                {
                  model: MasterUser,
                  attributes: ["id", "typeOfUser"],
                  include: [
                    {
                      model: MasterUserPersonal,
                      attributes: ["id", "firstName", "lastName"]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    })
      .then(discussion => {
        resolve({
          message: "Discussion fetched",
          data: discussion
        });
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
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
