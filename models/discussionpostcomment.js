'use strict';
module.exports = (sequelize, DataTypes) => {
  const DiscussionPostComment = sequelize.define('DiscussionPostComment', {
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
  DiscussionPostComment.associate = function(models) {
    // associations can be defined here

    DiscussionPostComment.belongsTo(models.DiscussionPost, {
      foreignKey: "discussionPostId"
    });

    DiscussionPostComment.belongsTo(models.MasterUser, {
      foreignKey: "commentedBy"
    });

  };
  return DiscussionPostComment;
};