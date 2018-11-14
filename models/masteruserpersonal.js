"use strict";
module.exports = (sequelize, DataTypes) => {
  const MasterUserPersonal = sequelize.define(
    "MasterUserPersonal",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      middleName: {
        type: DataTypes.STRING
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
        freezeTableName: true
    }
  );
  MasterUserPersonal.associate = function(models) {
    // associations can be defined here
    //master associations

    MasterUserPersonal.belongsTo(models.MasterUser);
  };
  return MasterUserPersonal;
};
