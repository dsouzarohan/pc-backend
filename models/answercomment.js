'use strict';
module.exports = (sequelize, DataTypes) => {
  const answerComment = sequelize.define('answerComment', {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  answerComment.associate = function(models) {
    // associations can be defined here


    answerComment.hasMany(models.answerCommentVote,{
      foreignKey: "answerCommentId",
      as: "answerCommentVotes"
    });

    answerComment.belongsTo(models.masterUser, {
      foreignKey: "commenterId",
      as: "answerCommenter"
    });

    answerComment.belongsTo(models.questionAnswer, {
      foreignKey: "answerId",
      as: "answer"
    });

  };
  return answerComment;
};