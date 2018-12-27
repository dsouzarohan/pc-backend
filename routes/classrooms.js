const express = require("express");
const router = express.Router();

const userAuth = require("../middleware/userIDAuth");

const classroomController = require("../controllers/classrooms");

//all classroom related routes

//join a classroom - for students
router.post("/join", userAuth({authorizationOnlyTo: "Student"}), (req, res) => {
  let classcode = req.body.classcode;
  let masterId = req.userData.userID;

  let type = req.userData.userType;

  if (type !== "Student") {
    return res.status(401).json({
      message: "Unauthorized",
      details: "Only students can join classrooms"
    });
  }

  classroomController
    .joinClassroom(classcode, masterId)
    .then(result => {
      console.log(result);
      res.json({
        success: result
      });
    })
    .catch(error => {
      res.json({
        failed: error.message
      });
    });
});

//create a classroom - for teachers
router.post("/create", userAuth({authorizationOnlyTo: "Teacher"}), (req, res) => {
  let teacherId = req.userData.userID;
  let type = req.userData.userType;

  if (type !== "Teacher") {
    return res.status(401).json({
      message: "Unauthorized",
      details: "Only teachers can create classrooms"
    });
  }

  let name = req.body.classroomName;
  let subject = req.body.classroomSubject;

  classroomController
    .createNewClassroom({
      name,
      subject,
      teacherId
    })
    .then(result => {
      res.json({
        message: result.message,
        classcode: result.classcode
      });
    })
    .catch(error => {
      res.json(error);
    });
});

//get all classrooms - for students and teachers
router.get("", userAuth(), (req, res) => {

  let masterId = req.userData.userID;
  let typeOfUser = req.userData.userType;

  classroomController
    .getClassrooms(masterId, typeOfUser)
    .then(result => {
      res.json(result);
    })
    .catch(error => {

      console.log('Routes#Classroom#Catch', error);

      res.status(400).send(error);
    });
});

module.exports = router;
