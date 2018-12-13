const {
  Sequelize,
  sequelize,

  Discussion,
  DiscussionPost,
  DiscussionComment,
  Classroom

} = require("../models");

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

module.exports = {
  createDiscussion
};
