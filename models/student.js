"use strict";
module.exports = (sequelize, DataTypes) => {
  const student = sequelize.define(
    "student",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      stream: {
        type: DataTypes.STRING,
        allowNull: false
      },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
      }
    },
    {}
  );
  student.associate = function(models) {
    // associations can be defined here

      //master association
      student.belongsTo(models.masterUser, {
        foreignKey: "masterUserId",
        as: "masterUserDetails"
      });

    //student classroom n:m association
    student.belongsToMany(models.classroom, {
      through: "studentClassrooms",
      as: "classrooms",
      foreignKey: "studentId"
    });

  };
  return student;
};
