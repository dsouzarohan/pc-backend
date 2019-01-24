"use strict";
module.exports = (sequelize, DataTypes) => {
  const masterUserContact = sequelize.define(
    "masterUserContact",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      phoneNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      alternateNumber: {
          type: DataTypes.STRING,
          unique: true
      },
      email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
      },
      address: {
          type: DataTypes.STRING,
          allowNull: false
      }
    },
    {}
  );
  masterUserContact.associate = function(models) {
    // associations can be defined here

    //master associations
    masterUserContact.belongsTo(models.masterUser, {
      foreignKey: "masterUserId",
      as: "masterUserDetails"
    });

    //Email association
    masterUserContact.hasOne(models.userCredential, {
      sourceKey: 'email',
      foreignKey: 'email',
      as: "userCredential"
    });
  };
  return masterUserContact;
};
