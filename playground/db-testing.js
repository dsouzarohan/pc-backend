const db = require("../models");

const {
  Sequelize, sequelize,
  Teacher, Classroom, MasterUser, Student
} = db;

let students;

Student.findAll({
  where: {
    stream: "BA"
  }
}).then( fetchedStudents => {
  students = fetchedStudents;

  console.log("Number of students fetched", students.length);

  return Classroom.findOne({
    where: {
      classcode: "dfhsbfhdjshfd"
    }
  });

}).then( classroom => {
  return classroom.addStudents(students);

}).then( () => {
  console.log("JAI MATA DI");
});