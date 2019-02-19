'use strict';
module.exports = (sequelize, DataTypes) => {
  const question = sequelize.define('question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  question.associate = function(models) {
    // associations can be defined here

    question.hasMany(models.questionComment, {
      foreignKey: "questionId",
      as: "questionComments"
    });

    question.hasMany(models.questionAnswer, {
      foreignKey: "questionId",
      as: "questionAnswers"
    });

    question.hasMany(models.questionVote, {
      foreignKey: "questionId",
      as: "questionVotes"
    });

    question.belongsTo(models.masterUser, {
      foreignKey: "authorId",
      as: "author"
    });

    question.belongsTo(models.classroom, {
      foreignKey: "classroomId",
      as: "classroom"
    });

  };
  return question;
};