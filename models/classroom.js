'use strict';
module.exports = (sequelize, DataTypes) => {
  const Classroom = sequelize.define('Classroom', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    classcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {});
  Classroom.associate = function(models) {
    // associations can be defined here

    Classroom.belongsTo(models.Teacher, {
      foreignKey: "createdBy"
    });


    //student classroom n:m association
    Classroom.belongsToMany(models.Student, {
      through: 'StudentClassrooms'
    });

    //discussion associations
    Classroom.hasMany(models.Discussion, {
      foreignKey: "discussionId"
    });

  };
  return Classroom;
};