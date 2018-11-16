"use strict";
module.exports = (sequelize, DataTypes) => {
  const MasterUserContact = sequelize.define(
    "MasterUserContact",
    {
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
  MasterUserContact.associate = function(models) {
    // associations can be defined here

    //master associations
    MasterUserContact.belongsTo(models.MasterUser);

    //Email association
    MasterUserContact.hasOne(models.UserCredential, {
      sourceKey: 'email',
      foreignKey: 'email'
    });
  };
  return MasterUserContact;
};
