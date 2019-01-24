"use strict";
module.exports = (sequelize, DataTypes) => {
  const masterUserPersonal = sequelize.define(
    "masterUserPersonal",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
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
  masterUserPersonal.associate = function(models) {
    // associations can be defined here
    //master associations

    masterUserPersonal.belongsTo(models.masterUser, {
      foreignKey: "masterUserId",
      as: "masterUserDetails"
    });
  };
  return masterUserPersonal;
};
