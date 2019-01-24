'use strict';
module.exports = (sequelize, DataTypes) => {
  const discussion = sequelize.define('discussion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {});
  discussion.associate = function(models) {
    // associations can be defined here

    discussion.belongsTo(models.masterUser, {
      foreignKey: "startedBy",
      as: "author"
    });

    discussion.belongsTo(models.classroom, {
      foreignKey: "classroomId",
      as: "classroom"
    });

    discussion.hasMany(models.discussionPost, {
      foreignKey: "discussionId",
      as: "discussionPosts"
    });

  };
  return discussion;
};