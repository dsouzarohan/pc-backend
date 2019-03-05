"use strict";
module.exports = (sequelize, DataTypes) => {
  const upload = sequelize.define(
    "upload",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.UUID
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  upload.associate = function(models) {
    // associations can be defined here

    upload.belongsTo(models.classroom, {
      as: "classroom",
      foreignKey: "classroomId"
    });

    upload.belongsTo(models.masterUser, {
      as: "uploader",
      foreignKey: "uploaderId"
    });

    upload.hasMany(models.file, {
      as: "files",
      foreignKey: "uploadId"
    })
  };
  return upload;
};
