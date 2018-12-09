const db = require("../models");

const {
  Sequelize, sequelize,
  Teacher, Classroom, MasterUser, Student,
  Discussion, DiscussionPost, DiscussionPostComment
} = db;

MasterUser.findOne({
  where: {
    id: "da096a21-4078-412d-bb0f-ca008559d4b1"
  }
}).then( masterUser => {


  if(!masterUser){
    return;
  }

  return masterUser.getTeacher();

}).then( teacher => {

  return teacher.createClassroom({
    name: "XYZ",
    subject: "ABC",
    classcode: "bfdhsbfhdsjfds"
  });

}).then( classroom => {

  console.log(classroom.get('classcode'));

}).catch( error => {
  console.log(error);
});


