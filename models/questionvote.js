'use strict';
module.exports = (sequelize, DataTypes) => {
  const questionVote = sequelize.define('questionVote', {
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
  questionVote.associate = function(models) {
    // associations can be defined here

    questionVote.belongsTo(models.question, {
      foreignKey: "questionId",
      as: "question"
    });

    questionVote.belongsTo(models.masterUser,{
      foreignKey: "voterId",
      as: "voter"
    });

  };

  return questionVote;
};