'use strict';

module.exports = (sequelize, DataTypes) => {

  const questionComment = sequelize.define('questionComment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});

  questionComment.associate = function(models) {
    // associations can be defined here

    questionComment.hasMany(models.questionCommentVote, {
      foreignKey: "questionCommentId",
      as: "questionCommentVotes"
    });

    questionComment.belongsTo(models.question, {
      foreignKey: "questionId",
      as: "question"
    });

    questionComment.belongsTo(models.masterUser, {
      foreignKey: "commenterId",
      as: "questionCommenter"
    });

    //instance methods
    questionComment.prototype.isVotedByUser = (userId) => {

      models.questionCommentVote.findOne({
        where: {
          voterId: userId,
          questionCommentId: this.id
        }
      }).then(fetchedQuestionVote => {
        return !!fetchedQuestionVote;
      });

    };

  };


  return questionComment;
};