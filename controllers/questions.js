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

    // todo: order all comments and answers and return
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
                as: "questionCommenter",
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

const createQuestionAnswer = (answerBody, questionId, answererId) => {
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
            message: "Question on which answer is to be created does not exist"
          });
        } else {
          return fetchedQuestion.createQuestionAnswer({
            body: answerBody,
            answererId
          });
        }
      })
      .then(createdQuestionAnswer => {
        if (!createdQuestionAnswer) {
          reject({
            message: "Answer could not be created"
          });
        } else {
          return questionAnswer.findOne({
            where: {
              id: createdQuestionAnswer.id
            },
            include: [
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
          });
        }
      })
      .then(createdQuestionAnswer => {
        resolve({
          message: "Answer created successfully",
          data: createdQuestionAnswer
        });
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

const createAnswerComment = (comment, questionAnswerId, commenterId) => {
  return new Promise((resolve, reject) => {
    questionAnswer
      .findOne({
        where: {
          id: questionAnswerId
        }
      })
      .then(fetchedQuestionAnswer => {
        if (!fetchedQuestionAnswer) {
          reject({
            message: "Answer on which comment is to be made does not exist"
          });
        } else {
          return fetchedQuestionAnswer.createAnswerComment({
            comment,
            commenterId
          });
        }
      })
      .then(createdAnswerComment => {
        return answerComment.findOne({
          where: {
            id: createdAnswerComment.id
          },
          include: [
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
        });
      })
      .then(createdAnswerComment => {
        resolve({
          message: "Answer comment created successfully",
          data: createdAnswerComment
        });
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

const addQuestionVote = (questionId, voterId, voteType) => {
  return new Promise((resolve, reject) => {
    let currentQuestion;

    question
      .findOne({
        where: {
          id: questionId
        }
      })
      .then(fetchedQuestion => {
        if (!fetchedQuestion) {
          reject({
            message: "Question to be voted does not exist"
          });
        } else {
          currentQuestion = fetchedQuestion;

          return questionVote.findOne({
            where: {
              questionId,
              voterId
            }
          });
        }
      })
      .then(fetchedQuestionVote => {
        if (!fetchedQuestionVote) {
          currentQuestion
            .createQuestionVote({
              voteType,
              voterId
            })
            .then(createdQuestionVote => {
              if (!createdQuestionVote) {
                reject({
                  message: "Could not add vote on question"
                });
              } else {
                return questionVote.findOne({
                  where: {
                    id: createdQuestionVote.id
                  },
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
                });
              }
            })
            .then(createdQuestionVote => {
              resolve({
                message: "ADDED",
                data: createdQuestionVote
              });
            })
            .catch(error => {
              reject({
                message: "Something went wrong - " + error.toString()
              });
            });
        } else {
          if (fetchedQuestionVote.voteType === voteType) {
            fetchedQuestionVote
              .destroy()
              .then(() => {
                resolve({
                  message: "REMOVED",
                  data: fetchedQuestionVote
                });
              })
              .catch(error => {
                reject({
                  message: "Something went wrong - " + error.toString()
                });
              });
          } else {
            fetchedQuestionVote
              .update({
                voteType
              })
              .then(() => {
                return questionVote.findOne({
                  where: {
                    id: fetchedQuestionVote.id
                  },
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
                });
              })
              .then(changedQuestionVote => {
                resolve({
                  message: "CHANGED",
                  data: changedQuestionVote
                });
              })
              .catch(error => {
                reject({
                  message: "Something went wrong - " + error.toString()
                });
              });
          }
        }
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

const addQuestionCommentVote = (questionCommentId, voterId, voteType) => {
  return new Promise((resolve, reject) => {
    let currentQuestionComment;

    questionComment
      .findOne({
        where: {
          id: questionCommentId
        }
      })
      .then(fetchedQuestionComment => {
        if (!fetchedQuestionComment) {
          reject({
            message: "Question comment to be voted does not exist"
          });
        } else {
          currentQuestionComment = fetchedQuestionComment;

          return questionCommentVote.findOne({
            where: {
              questionCommentId,
              voterId
            }
          });
        }
      })
      .then(fetchedQuestionCommentVote => {
        if (!fetchedQuestionCommentVote) {
          currentQuestionComment
            .createQuestionCommentVote({
              voteType,
              voterId
            })
            .then(createdQuestionCommentVote => {
              if (!createdQuestionCommentVote) {
                reject({
                  message: "Could not add vote on question comment"
                });
              } else {
                return questionCommentVote.findOne({
                  where: {
                    id: createdQuestionCommentVote.id
                  },
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
                });
              }
            })
            .then(createdQuestionCommentVote => {
              resolve({
                message: "ADDED",
                data: createdQuestionCommentVote
              });
            })
            .catch(error => {
              reject({
                message: "Something went wrong - " + error.toString()
              });
            });
        } else {
          if (fetchedQuestionCommentVote.voteType === voteType) {
            fetchedQuestionCommentVote
              .destroy()
              .then(() => {
                resolve({
                  message: "REMOVED",
                  data: fetchedQuestionCommentVote
                });
              })
              .catch(error => {
                reject({
                  message: "Something went wrong - " + error.toString()
                });
              });
          } else {
            fetchedQuestionCommentVote
              .update({
                voteType
              })
              .then(() => {
                return questionCommentVote.findOne({
                  where: {
                    id: fetchedQuestionCommentVote.id
                  },
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
                });
              })
              .then(changedQuestionCommentVote => {
                resolve({
                  message: "CHANGED",
                  data: changedQuestionCommentVote
                });
              })
              .catch(error => {
                reject({
                  message: "Something went wrong - " + error.toString()
                });
              });
          }
        }
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

const addQuestionAnswerVote = (questionAnswerId, voterId, voteType) => {
  return new Promise((resolve, reject) => {
    let currentQuestionAnswer;

    questionAnswer
      .findOne({
        where: {
          id: questionAnswerId
        }
      })
      .then(fetchedQuestionAnswer => {
        if (!fetchedQuestionAnswer) {
          reject({
            message: "Question answer to be voted does not exist"
          });
        } else {
          currentQuestionAnswer = fetchedQuestionAnswer;

          return answerVote.findOne({
            where: {
              questionAnswerId,
              voterId
            }
          });
        }
      })
      .then(fetchedQuestionAnswerVote => {
        if (!fetchedQuestionAnswerVote) {
          currentQuestionAnswer
            .createAnswerVote({
              voteType,
              voterId
            })
            .then(createdQuestionAnswerVote => {
              if (!createdQuestionAnswerVote) {
                reject({
                  message: "Could not add vote on question answer"
                });
              } else {
                return answerVote.findOne({
                  where: {
                    id: createdQuestionAnswerVote.id
                  },
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
                });
              }
            })
            .then(createdQuestionAnswerVote => {
              resolve({
                message: "ADDED",
                data: createdQuestionAnswerVote
              });
            })
            .catch(error => {
              reject({
                message: "Something went wrong - " + error.toString()
              });
            });
        } else {
          if (fetchedQuestionAnswerVote.voteType === voteType) {
            fetchedQuestionAnswerVote
              .destroy()
              .then(() => {
                resolve({
                  message: "REMOVED",
                  data: fetchedQuestionAnswerVote
                });
              })
              .catch(error => {
                reject({
                  message: "Something went wrong - " + error.toString()
                });
              });
          } else {
            fetchedQuestionAnswerVote
              .update({
                voteType
              })
              .then(() => {
                return answerVote.findOne({
                  where: {
                    id: fetchedQuestionAnswerVote.id
                  },
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
                });
              })
              .then(changedQuestionAnswerVote => {
                resolve({
                  message: "CHANGED",
                  data: changedQuestionAnswerVote
                });
              })
              .catch(error => {
                reject({
                  message: "Something went wrong - " + error.toString()
                });
              });
          }
        }
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

const addAnswerCommentVote = (answerCommentId, voterId, voteType) => {
  return new Promise((resolve, reject) => {
    let currentAnswerComment;

    answerComment
      .findOne({
        where: {
          id: answerCommentId
        }
      })
      .then(fetchedAnswerComment => {
        if (!fetchedAnswerComment) {
          reject({
            message: "Question comment to be voted does not exist"
          });
        } else {
          currentAnswerComment = fetchedAnswerComment;

          return answerCommentVote.findOne({
            where: {
              answerCommentId,
              voterId
            }
          });
        }
      })
      .then(fetchedAnswerCommentVote => {
        if (!fetchedAnswerCommentVote) {
          currentAnswerComment
            .createAnswerCommentVote({
              voteType,
              voterId
            })
            .then(createdAnswerCommentVote => {
              if (!createdAnswerCommentVote) {
                reject({
                  message: "Could not add vote on answer comment"
                });
              } else {
                return answerCommentVote.findOne({
                  where: {
                    id: createdAnswerCommentVote.id
                  },
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
                });
              }
            })
            .then(createdAnswerCommentVote => {
              resolve({
                message: "ADDED",
                data: createdAnswerCommentVote
              });
            })
            .catch(error => {
              reject({
                message: "Something went wrong - " + error.toString()
              });
            });
        } else {
          if (fetchedAnswerCommentVote.voteType === voteType) {
            fetchedAnswerCommentVote
              .destroy()
              .then(() => {
                resolve({
                  message: "REMOVED",
                  data: fetchedAnswerCommentVote
                });
              })
              .catch(error => {
                reject({
                  message: "Something went wrong - " + error.toString()
                });
              });
          } else {
            fetchedAnswerCommentVote
              .update({
                voteType
              })
              .then(() => {
                return answerCommentVote.findOne({
                  where: {
                    id: fetchedAnswerCommentVote.id
                  },
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
                });
              })
              .then(changedAnswerCommentVote => {
                resolve({
                  message: "CHANGED",
                  data: changedAnswerCommentVote
                });
              })
              .catch(error => {
                reject({
                  message: "Something went wrong - " + error.toString()
                });
              });
          }
        }
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

const selectAnswer = (questionId, answerId) => {
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
            message: "Question on which answer to be selected does not exist"
          });
        } else {
          return questionAnswer.findOne({
            where: {
              questionId,
              isSelectedAnswer: true
            }
          });
        }
      })
      .then(fetchedAnswer => {
        if (fetchedAnswer) {

          let selectedAnswer;
          let oldAnswerId = fetchedAnswer.id;

          console.log("First update");

          //todo: two updates, should be a transaction

          fetchedAnswer
            .update({
              isSelectedAnswer: false
            })
            .then(() => {
              return questionAnswer.findOne({
                where: {
                  id: answerId
                }
              });
            })
            .then(currentAnswer => {
              if (!currentAnswer) {
                reject({
                  message: "Answer to be selected does not exist"
                });
              } else {

                selectedAnswer = currentAnswer;

                return currentAnswer.update({
                  isSelectedAnswer: currentAnswer.id !== fetchedAnswer.id
                });
              }
            })
            .then(() => {
              resolve({
                message: "Selected answer updated successfully",
                data: selectedAnswer,
                oldAnswerId: oldAnswerId === selectedAnswer.id ? selectedAnswer.id : oldAnswerId,
                status: oldAnswerId === selectedAnswer.id ? "REMOVED" : "CHANGED"
              });
            })
            .catch(error => {
              reject({
                message: "Something went wrong - " + error.toString()
              });
            });
        } else {

          let selectedAnswer;

          questionAnswer
            .findOne({
              where: {
                id: answerId
              }
            })
            .then(fetchedAnswer => {
              if (!fetchedAnswer) {
                reject({
                  message: "Answer to be selected does not exist"
                });
              } else {
                console.log("Second update");

                selectedAnswer = fetchedAnswer;

                return fetchedAnswer.update({
                  isSelectedAnswer: true
                });
              }
            })
            .then(() => {
              resolve({
                message: "Selected answer updated successfully",
                data: selectedAnswer,
                status: "SELECTED"
              });
            })
            .catch(error => {
              reject({
                message: "Something went wrong - " + error.toString()
              });
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

module.exports = {
  getQuestions,
  createQuestion,
  createQuestionComment,
  createQuestionAnswer,
  createAnswerComment,
  addQuestionVote,
  addQuestionCommentVote,
  addQuestionAnswerVote,
  addAnswerCommentVote,
  selectAnswer
};
