"use strict";
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
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
  Student.associate = function(models) {
    // associations can be defined here

      //master association
      Student.belongsTo(models.MasterUser, {
        foreignKey: "masterUserId"
      });

    //student classroom n:m association
    Student.belongsToMany(models.Classroom, {
      through: "StudentClassrooms"
    });

  };
  return Student;
};
