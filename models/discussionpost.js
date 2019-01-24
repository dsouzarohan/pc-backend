'use strict';
module.exports = (sequelize, DataTypes) => {
  const discussionPost = sequelize.define('discussionPost', {
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
  discussionPost.associate = function(models) {
    // associations can be defined here

    discussionPost.belongsTo(models.discussion, {
      foreignKey: "discussionId",
      as: "discussion"
    });

    discussionPost.belongsTo(models.masterUser, {
      foreignKey: "postedBy",
      as: "poster"
    });

    discussionPost.hasMany(models.discussionPostComment, {
      foreignKey: "discussionPostId",
      as: "discussionPostComments"
    });

  };
  return discussionPost;
};