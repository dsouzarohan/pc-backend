'use strict';
module.exports = (sequelize, DataTypes) => {
  const discussionPostComment = sequelize.define('discussionPostComment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});
  discussionPostComment.associate = function(models) {
    // associations can be defined here

    discussionPostComment.belongsTo(models.discussionPost, {
      foreignKey: "discussionPostId",
      as: "discussionPost"
    });

    discussionPostComment.belongsTo(models.masterUser, {
      foreignKey: "commentedBy",
      as: "commenter"
    });

  };
  return discussionPostComment;
};