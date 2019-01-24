"use strict";
module.exports = (sequelize, DataTypes) => {
  const userCredential = sequelize.define(
    "userCredential",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  userCredential.associate = function(models) {
    // associations can be defined here

      //master associations
      userCredential.belongsTo(models.masterUser, {
        foreignKey: "masterUserId",
        as: "masterUserDetails"
      });

      userCredential.belongsTo(models.masterUserContact, {
        foreignKey: 'email',
        targetKey: 'email',
        as: "contactDetails"
      });

  };
  return userCredential;
};
