'use strict';
module.exports = (sequelize, DataTypes) => {
  const questionCommentVote = sequelize.define('questionCommentVote', {
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
  questionCommentVote.associate = function(models) {
    // associations can be defined here

    questionCommentVote.belongsTo(models.questionVote,{
      foreignKey: "questionCommentId",
      as: "comment"
    });

    questionCommentVote.belongsTo(models.masterUser, {
      foreignKey: "voterId",
      as: "voter"
    })

  };
  return questionCommentVote;
};