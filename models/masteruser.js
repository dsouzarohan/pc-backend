"use strict";
module.exports = (sequelize, DataTypes) => {
  const masterUser = sequelize.define(
    "masterUser",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      typeOfUser: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  masterUser.associate = function(models) {
    // associations can be defined here

    //master associations
    masterUser.hasOne(models.masterUserPersonal, {
      foreignKey: "masterUserId",
      as: "personalDetails"
    });


    masterUser.hasOne(models.masterUserContact, {
      foreignKey: "masterUserId",
      as: "contactDetails"
    });

    //user associations
    masterUser.hasOne(models.student, {
      foreignKey: "masterUserId",
      as: "student"
    });

    masterUser.hasOne(models.teacher, {
      foreignKey: "masterUserId",
      as: "teacher"
    });

    //credential association
    masterUser.hasOne(models.userCredential, {
      foreignKey: "masterUserId",
      as: "userCredential"
    });

    //discussion association
    masterUser.hasMany(models.discussion, {
      foreignKey: "startedBy",
      as: "discussions"
    });

    masterUser.hasMany(models.discussionPost, {
      foreignKey: "postedBy",
      as: "discussionPosts"
    });

    masterUser.hasMany(models.discussionPostComment, {
      foreignKey: "commentedBy",
      as: "discussionPostComments"
    });

    //QnA associations

    masterUser.hasMany(models.question, {
      foreignKey: "authorId",
      as: "questions"
    });

    masterUser.hasMany(models.questionComment, {
      foreignKey: "commenterId",
      as: "questionComments"
    });

    masterUser.hasMany(models.questionVote, {
      foreignKey: "voterId",
      as: "questionVotes"
    });

    masterUser.hasMany(models.questionCommentVote, {
      foreignKey: "voterId",
      as: "questionCommentVotes"
    });

    masterUser.hasMany(models.questionAnswer, {
      foreignKey: "answererId",
      as: "answers"
    });

    masterUser.hasMany(models.answerComment, {
      foreignKey: "commenterId",
      as: "answerComments"
    });

    masterUser.hasMany(models.answerVote, {
      foreignKey: "voterId",
      as: "answerVotes"
    });

    masterUser.hasMany(models.answerCommentVote, {
      foreignKey: "voterId",
      as: "answerCommentVotes"
    });


  };

  return masterUser;
};
