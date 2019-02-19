"use strict";
module.exports = (sequelize, DataTypes) => {
  const teacher = sequelize.define(
    "teacher",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      }
    },
    {}
  );
  teacher.associate = function(models) {
    // associations can be defined here

    //master association
    teacher.belongsTo(models.masterUser, {
      foreignKey: "masterUserId",
      as: "masterUserDetails"
    });

    //classroom association
    teacher.hasMany(models.classroom, {
      foreignKey: "createdBy",
      as: "classrooms"
    });

    //announcements association

    teacher.hasMany(models.announcement, {
      foreignKey: "createdBy",
      as: "announcements"
    });

    //event associations

    teacher.hasMany(models.event, {
      foreignKey: "teacherId",
      as: "events"
    });
  };
  return teacher;
};
