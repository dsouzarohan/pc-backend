"use strict";
module.exports = (sequelize, DataTypes) => {
  const questionAnswer = sequelize.define(
    "questionAnswer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isSelectedAnswer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {}
  );
  questionAnswer.associate = function(models) {
    // associations can be defined here

    questionAnswer.hasMany(models.answerComment, {
      foreignKey: "answerId",
      as: "answerComments"
    });

    questionAnswer.hasMany(models.answerVote, {
      foreignKey: "questionAnswerId",
      as: "answerVotes"
    });

    questionAnswer.belongsTo(models.question, {
      foreignKey: "questionId",
      as: "question"
    });

    questionAnswer.belongsTo(models.masterUser, {
      foreignKey: "answererId",
      as: "answerer"
    });

  };
  return questionAnswer;
};
