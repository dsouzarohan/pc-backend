const db = require("../models");

const {
  Sequelize,
  sequelize,

  Classroom,
  Student,
  Teacher,
  MasterUser
} = db;

const randomUtility = require("../utilities/random");

const createNewClassroom = classroomDetails => {
  let { name, subject, teacherId } = classroomDetails;

  return new Promise((resolve, reject) => {
    MasterUser.findOne({
      where: {
        id: teacherId
      }
    })
      .then(masterUser => {
        if (!masterUser) {
          reject({
            message: "User does not exist"
          });
        }

        return masterUser.getTeacher();
      })
      .then(teacher => {
        if (!teacher) {
          reject({
            message: "Teacher does not exist"
          });
        }

        let classcode = randomUtility.randomString();

        return teacher.createClassroom({
          name: name,
          subject: subject,
          classcode: classcode
        });
      })
      .then(classroom => {
        resolve({
          message: "Classroom created successfully",
          classcode: classroom.get("classcode")
        });
      })
      .catch(error => {
        reject({
          message: "Something went wrong"
        });
      });
  });
};

const joinClassroom = (classcode, masterId) => {

  let fetchedClassroom;
  let fetchedStudent;

  return new Promise((resolve, reject) => {
    Classroom.findOne({
      where: {
        classcode
      }
    })
      .then(classroom => {
        fetchedClassroom = classroom;

        if (!fetchedClassroom) {
          reject({
            message: "Classroom code is invalid"
          });
        }

        return Student.findOne({
          where: {
            masterUserID: masterId
          }
        });
      })
      .then(student => {

        fetchedStudent = student;
        return fetchedClassroom.hasStudent(student);
      })
      .then(classroomHasStudent => {
        if (classroomHasStudent) {
          reject({
            message: "Student already part of classroom"
          });
        } else {
          return fetchedClassroom.addStudent(fetchedStudent);
        }
      })
      .then(result => {
        resolve({
          message: "Student added to classroom"
        });
      })
      .catch(error => {

        console.log(error);

        reject({
          message: "Something went wrong"
        });
      });
  });
};

module.exports = {
  joinClassroom,
  createNewClassroom
};
