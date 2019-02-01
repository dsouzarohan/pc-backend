const {
  sequelize,
  Sequelize,
  classroom,
  masterUser,
  masterUserPersonal,
  question,
  questionAnswer,
  questionComment,
  questionVote,
  answerComment,
  answerVote,
  questionCommentVote,
  answerCommentVote
} = require("../models");

const getQuestions = classroomId => {
  return new Promise((resolve, reject) => {
    question
      .findAll({
        where: {
          classroomId
        },
        include: [
          {
            model: questionAnswer,
            as: "questionAnswers",
            include: [
              {
                model: answerComment,
                as: "answerComments",
                include: [
                  {
                    model: answerCommentVote,
                    as: "answerCommentVotes",
                    include: [
                      {
                        model: masterUser,
                        as: "voter",
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
                  },
                  {
                    model: masterUser,
                    as: "answerCommenter",
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
              },
              {
                model: answerVote,
                as: "answerVotes",
                include: [
                  {
                    model: masterUser,
                    as: "voter",
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
              },
              {
                model: masterUser,
                as: "answerer",
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
          },
          {
            model: questionComment,
            as: "questionComments",
            include: [
              {
                model: masterUser,
                as: "questionCommenter",
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
                model: questionCommentVote,
                as: "questionCommentVotes",
                include: [
                  {
                    model: masterUser,
                    as: "voter",
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
          },
          {
            model: questionVote,
            as: "questionVotes",
            include: [
              {
                model: masterUser,
                as: "voter",
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
          },
          {
            model: questionAnswer,
            as: "answeredQuestion"
          },
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
      })
      .then(fetchedQuestions => {
        resolve({
          message: "Fetched questions successfully",
          data: fetchedQuestions
        });
      })
      .catch(error => {
        console.log("@GetQuestions#Catch", error);

        reject({
          message: "Something went wrong - " + error
        });
      });
  });
};

const createQuestion = (name, body, classroomId, authorId) => {
  return new Promise((resolve, reject) => {
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
              "Classroom in which question is to be created does not exist"
          });
        } else {
          return fetchedClassroom.createQuestion({
            name,
            body,
            authorId
          });
        }
      })
      .then(createdQuestion => {
        if (!createdQuestion) {
          reject({
            message: "Could not create question"
          });
        } else {
          return question.findOne({
            where: {
              id: createdQuestion.id
            },
            include: [
              {
                model: masterUser,
                as: "author"
              }
            ]
          });
        }
      })
      .then(createdQuestion => {
        console.log(createdQuestion.get({ plain: true }));

        resolve({
          message: "Question created successfully",
          data: createdQuestion
        });
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

const createQuestionComment = (comment, questionId, commenterId) => {
  return new Promise((resolve, reject) => {
    question
      .findOne({
        where: {
          id: questionId
        }
      })
      .then(fetchedQuestion => {
        if (!fetchedQuestion) {
          reject({
            message:
              "The question on which the comment is to be made does not exist"
          });
        } else {
          return fetchedQuestion.createQuestionComment({
            comment,
            commenterId
          });
        }
      })
      .then(createdQuestionComment => {
        if (!createdQuestionComment) {
          reject({
            message: "Could not create question comment"
          });
        } else {
          return questionComment.findOne({
            where: {
              id: createdQuestionComment.id
            },
            include: [
              {
                model: masterUser,
                as: "questionCommenter"
              }
            ]
          });
        }
      })
      .then(createdQuestionComment => {
        resolve({
          message: "Created question comment successfully",
          data: createdQuestionComment
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
  getQuestions,
  createQuestion,
  createQuestionComment
};
