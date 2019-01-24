'use strict';
module.exports = (sequelize, DataTypes) => {
  const studentClassroom = sequelize.define('studentClassroom', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    classroomId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {});
  studentClassroom.associate = function(models) {
    // associations can be defined here

    studentClassroom.belongsTo(models.classroom, {
      foreignKey: "classroomId"
    });

    studentClassroom.belongsTo(models.student, {
      foreignKey: 'studentId'
    });

  };
  return studentClassroom;
};