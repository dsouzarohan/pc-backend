'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});
  event.associate = function(models) {
    // associations can be defined here

    event.belongsTo(models.teacher, {
      foreignKey: "teacherId",
      as: "teacher"
    });

    event.belongsTo(models.classroom, {
      foreignKey: "classroomId",
      as: "classroom"
    })

  };
  return event;
};