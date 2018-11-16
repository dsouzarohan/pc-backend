"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserCredential = sequelize.define(
    "UserCredential",
    {
      // email: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   unique: true
      // },
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
      UserCredential.belongsTo(models.MasterUser);
      UserCredential.belongsTo(models.MasterUserContact, {foreignKey: 'email', targetKey: 'email'});

  };
  return UserCredential;
};
