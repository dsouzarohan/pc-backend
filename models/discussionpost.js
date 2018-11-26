'use strict';
module.exports = (sequelize, DataTypes) => {
  const DiscussionPost = sequelize.define('DiscussionPost', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});
  DiscussionPost.associate = function(models) {
    // associations can be defined here

    DiscussionPost.belongsTo(models.Discussion, {
      foreignKey: "discussionId"
    });

    DiscussionPost.belongsTo(models.MasterUser, {
      foreignKey: "postedBy"
    });

    DiscussionPost.hasMany(models.DiscussionPostComment, {
      foreignKey: "discussionPostId"
    });

  };
  return DiscussionPost;
};