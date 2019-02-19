'use strict';
module.exports = (sequelize, DataTypes) => {
  const answerCommentVote = sequelize.define('answerCommentVote', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true
    },
    voteType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  answerCommentVote.associate = function(models) {
    // associations can be defined here

    answerCommentVote.belongsTo(models.answerComment, {
      foreignKey: "answerCommentId",
      as: "answerComment"
    });

    answerCommentVote.belongsTo(models.masterUser, {
      foreignKey: "voterId",
      as: "voter"
    });

  };
  return answerCommentVote;
};