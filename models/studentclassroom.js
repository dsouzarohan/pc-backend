'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentClassroom = sequelize.define('StudentClassroom', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
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
  StudentClassroom.associate = function(models) {
    // associations can be defined here

    StudentClassroom.belongsTo(models.Classroom, {
      foreignKey: "classroomId"
    });

    StudentClassroom.belongsTo(models.Student, {
      foreignKey: 'studentId'
    });

  };
  return StudentClassroom;
};