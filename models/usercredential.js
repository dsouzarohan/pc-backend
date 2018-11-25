"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserCredential = sequelize.define(
    "UserCredential",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  UserCredential.associate = function(models) {
    // associations can be defined here

      //master associations
      UserCredential.belongsTo(models.MasterUser, {
        foreignKey: "masterUserId"
      });
      UserCredential.belongsTo(models.MasterUserContact, {foreignKey: 'email', targetKey: 'email'});

  };
  return UserCredential;
};
