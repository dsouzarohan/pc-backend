'use strict';
module.exports = (sequelize, DataTypes) => {
  const answerVote = sequelize.define('answerVote', {
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
  answerVote.associate = function(models) {
    // associations can be defined here

    answerVote.belongsTo(models.questionAnswer, {
      foreignKey: "questionAnswerId",
      as: "answer"
    });

    answerVote.belongsTo(models.masterUser, {
      foreignKey: "voterId",
      as: "voter"
    })

  };
  return answerVote;
};