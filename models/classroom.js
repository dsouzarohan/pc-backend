'use strict';
module.exports = (sequelize, DataTypes) => {
  const classroom = sequelize.define('classroom', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
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
    classCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {});
  classroom.associate = function(models) {
    // associations can be defined here

    classroom.belongsTo(models.teacher, {
      foreignKey: "createdBy",
      as: "teacher"
    });


    //student classroom n:m association
    classroom.belongsToMany(models.student, {
      through: 'studentClassrooms',
      foreignKey: "classroomId",
      as: "students"
    });

    //discussion associations
    classroom.hasMany(models.discussion, {
      foreignKey: "classroomId",
      as: "discussions"
    });

  };
  return classroom;
};