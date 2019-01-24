const {
  Sequelize,
  sequelize,

  discussion,
  discussionPost,
  discussionPostComment,
  classroom,
  masterUser,
  masterUserPersonal
} = require("../models");

//create controllers

const createDiscussion = discussionDetails => {
  return new Promise((resolve, reject) => {
    let topic = discussionDetails.discussionTopic;
    let body = discussionDetails.discussionBody;
    let classroomId = discussionDetails.classroomId;
    let userId = discussionDetails.userId;

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
              "Classroom in which discussion is to be created does not exist"
          });
        }

        return fetchedClassroom.createDiscussion({
          topic,
          body,
          startedBy: userId
        });
      })
      .then(createdDiscussion => {
        if (createdDiscussion) {
          return discussion.findOne({
            where: {
              id: createdDiscussion.id
            },
            include: [
              {
                model: masterUser,
                as: "author",
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
        } else {
          reject({
            message: "Discussion not created"
          });
        }
      })
      .then(createdDiscussion => {
        resolve({
          message: "Discussion created successfully",
          discussion: createdDiscussion
        });
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

    discussion
      .findOne({
        where: {
          id: discussionId
        }
      })
      .then(fetchedDiscussion => {
        if (!fetchedDiscussion) {
          reject({
            message: "Discussion on which post is to be created does not exist"
          });
        }

        return fetchedDiscussion.createDiscussionPost({
          body,
          postedBy: userId
        });
      })
      .then(createdDiscussionPost => {
        if (createdDiscussionPost) {
          return discussionPost.findOne({
            where: {
              id: createdDiscussionPost.id
            },
            include: [
              {
                model: masterUser,
                as: "poster",
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
      .then(fetchedDiscussionPost => {
        if (fetchedDiscussionPost) {
          resolve({
            message: "Discussion post created",
            discussionPost: fetchedDiscussionPost
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

    discussionPost
      .findOne({
        where: {
          id: discussionPostId
        }
      })
      .then(fetchedDiscussionPost => {
        if (!fetchedDiscussionPost) {
          reject({
            message:
              "Discussion post on which comment is to be created does not exist"
          });
        }

        return fetchedDiscussionPost.createDiscussionPostComment({
          body,
          commentedBy: userId
        });
      })
      .then(createdDiscussionPostComment => {
        if (createdDiscussionPostComment) {
          // resolve({
          //   message: "Discussion Post Comment created"
          // });

          return discussionPostComment.findOne({
            where: {
              id: createdDiscussionPostComment.id
            },
            include: [
              {
                model: masterUser,
                as: "commenter",
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
        } else {
          reject({
            message: "Comment could not be created"
          });
        }
      })
      .then(fetchedDiscussionPostComment => {
        resolve({
          message: "Discussion post comment created successfully",
          discussionComment: fetchedDiscussionPostComment
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
    discussion
      .findAll({
        where: {
          classroomId
        },
        order: [
          [
            { model: discussionPost, as: "discussionPosts" },
            "createdAt",
            "DESC"
          ],
          [
            { model: discussionPost, as: "discussionPosts" },
            { model: discussionPostComment, as: "discussionPostComments" },
            "createdAt",
            "DESC"
          ]
        ],
        include: [
          {
            model: masterUser,
            as: "author",
            attributes: ["id", "typeOfUser"],
            include: [
              {
                model: masterUserPersonal,
                as: "personalDetails",
                attributes: ["id", "firstName", "lastName"]
              }
            ]
          },{
            model: discussionPost,
            as: "discussionPosts",
            include: [
              {
                model: masterUser,
                as: "poster",
                attributes: ["id", "typeOfUser"],
                include: [
                  {
                    model: masterUserPersonal,
                    as: "personalDetails",
                    attributes: ["id", "firstName", "lastName"]
                  }
                ]
              },
              {
                model: discussionPostComment,
                as: "discussionPostComments",
                include: [
                  {
                    model: masterUser,
                    as: "commenter",
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

module.exports = {
  createDiscussion,
  createDiscussionPost,
  createDiscussionPostComment,

  getAllDiscussions
};
