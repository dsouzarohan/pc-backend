"use strict";
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    "Teacher",
    {
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      }
    },
    {}
  );
  Teacher.associate = function(models) {
    // associations can be defined here

    //master association
    Teacher.belongsTo(models.MasterUser);

    //classroom association
    Teacher.hasMany(models.Classroom, {
      foreignKey: "createdBy"
    })
  };
  return Teacher;
};
