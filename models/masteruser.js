"use strict";
module.exports = (sequelize, DataTypes) => {
  const MasterUser = sequelize.define(
    "MasterUser",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
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
    MasterUser.hasOne(models.MasterUserPersonal, {
      foreignKey: "masterUserId"
    });
    MasterUser.hasOne(models.MasterUserContact, {
      foreignKey: "masterUserId"
    });

    //user associations
    MasterUser.hasOne(models.Student, {
      foreignKey: "masterUserId"
    });
    MasterUser.hasOne(models.Teacher, {
      foreignKey: "masterUserId"
    });

    //credential association
    MasterUser.hasOne(models.UserCredential, {
      foreignKey: "masterUserId"
    });

    //discussion association
    MasterUser.hasMany(models.Discussion, {
      foreignKey: "startedBy"
    });

    MasterUser.hasMany(models.DiscussionPost, {
      foreignKey: "postedBy"
    });

    MasterUser.hasMany(models.DiscussionPostComment, {
      foreignKey: "commentedBy"
    });

  };

  return MasterUser;
};
