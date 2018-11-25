"use strict";
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    "Teacher",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
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
    Teacher.belongsTo(models.MasterUser, {
      foreignKey: "masterUserId"
    });

    //classroom association
    Teacher.hasMany(models.Classroom, {
      foreignKey: "createdBy"
    })
  };
  return Teacher;
};
