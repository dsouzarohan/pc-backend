'use strict';
module.exports = (sequelize, DataTypes) => {
  const Discussion = sequelize.define('Discussion', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
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
  Discussion.associate = function(models) {
    // associations can be defined here

    Discussion.belongsTo(models.MasterUser, {
      foreignKey: "startedBy"
    });

    Discussion.belongsTo(models.Classroom, {
      foreignKey: "classroomId"
    });

    Discussion.hasMany(models.DiscussionPost, {
      foreignKey: "discussionId"
    });

  };
  return Discussion;
};