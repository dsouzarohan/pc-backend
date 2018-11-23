"use strict";
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
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
      Student.belongsTo(models.MasterUser);

  };
  return Student;
};
