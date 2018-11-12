"use strict";
module.exports = (sequelize, DataTypes) => {
  const MasterUser = sequelize.define(
    "MasterUser",
    {
      typeOfUser: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  MasterUser.associate = function(models) {
    // associations can be defined here

    //master associations
    MasterUser.hasOne(models.MasterUserPersonal);
    MasterUser.hasOne(models.MasterUserContact);

    //user associations
    MasterUser.hasOne(models.Student);
    MasterUser.hasOne(models.Teacher);

    //credential association
      MasterUser.hasOne(models.UserCredential);

  };
  return MasterUser;
};
