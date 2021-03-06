const db = require("../models");

const {
  Sequelize,
  sequelize,

  classroom,
  student,
  teacher,
  discussion,
  masterUser,
  masterUserPersonal
} = db;

const randomUtility = require("../utilities/random");

const createNewClassroom = classroomDetails => {
  let { name, subject, teacherId } = classroomDetails;

  return new Promise((resolve, reject) => {
    masterUser
      .findOne({
        where: {
          id: teacherId
        }
      })
      .then(createdMasterUser => {
        if (!createdMasterUser) {
          reject({ message: "User does not exist" });
        }

        return createdMasterUser.getTeacher();
      })
      .then(fetchedTeacher => {
        console.log("Fetched teacher", fetchedTeacher.get({ plain: true }));

        if (!fetchedTeacher) {
          reject({ message: "Teacher does not exist" });
        }

        let classCode = randomUtility.randomString();

        return fetchedTeacher.createClassroom({
          name: name,
          subject: subject,
          classCode: classCode
        });
      })
      .then(createdClassroom => {
        console.log("Created classroom", createdClassroom.get({ plain: true }));

        return classroom.findOne({
          where: {
            id: createdClassroom.id
          },
          include: [
            {
              model: teacher,
              as: "teacher",
              include: [
                {
                  model: masterUser,
                  as: "masterUserDetails",
                  attributes: ["id", "typeOfUser"],
                  include: [
                    {
                      model: masterUserPersonal,
                      as: "personalDetails",
                      attributes: ["id", "firstName", "lastName"]
                    }
                  ]
                }
              ]
            }
          ]
        });
      })
      .then(fetchedClassroom => {
      resolve({
        message: "Classroom created successfully",
        createdClassroom: fetchedClassroom
      });
      })
      .catch(error => {
        console.log("Controller catch", error);
        reject({ message: "Something went wrong - " + error.toString() });
      });
  });
};

const joinClassroom = (classCode, masterId) => {
  let fetchedClassroom;
  let fetchedStudent;

  return new Promise((resolve, reject) => {
    classroom
      .findOne({
        where: {
          classCode
        }
      })
      .then(classroom => {
        fetchedClassroom = classroom;

        if (!fetchedClassroom) {
          console.log("No classrooms");
          reject({ message: "Classroom code is invalid" });
        }

        return student.findOne({
          where: {
            masterUserId: masterId
          }
        });
      })
      .then(student => {
        fetchedStudent = student;
        return fetchedClassroom.hasStudent(student);
      })
      .then(classroomHasStudent => {
        if (classroomHasStudent) {
          reject({ message: "Student already part of classroom" });
        } else {
          return fetchedClassroom.addStudent(fetchedStudent);
        }
      })
      .then(result => {

        return classroom.findOne({
          where: {
            id: fetchedClassroom.id
          },
          include: [
            {
              model: teacher,
              as: "teacher",
              include: [
                {
                  model: masterUser,
                  as: "masterUserDetails",
                  attributes: ["id", "typeOfUser"],
                  include: [
                    {
                      model: masterUserPersonal,
                      as: "personalDetails",
                      attributes: ["id", "firstName", "lastName"]
                    }
                  ]
                }
              ]
            }
          ]
        });

      }).then( joinedClassroom => {
      resolve({
        message: "Student added to classroom",
        classroom: joinedClassroom
      });
    })
      .catch(error => {
        reject({ message: "Something went wrong - " + error.toString() });
      });
  });
};

const getClassrooms = (masterId, typeOfUser) => {
  return new Promise((resolve, reject) => {
    if (typeOfUser === "Student") {
      student
        .findOne({
          where: {
            masterUserID: masterId
          }
        })
        .then(fetchedStudent => {

          return student.findOne({
            where: {
              id: fetchedStudent.id
            },
            include: [
              {
                model: classroom,
                as: "classrooms",
                include: [
                  {
                    model: student,
                    as: "students",
                    include: [
                      {
                        model: masterUser,
                        as: "masterUserDetails",
                        attributes: ["id", "typeOfUser"],
                        include: [
                          {
                            model: masterUserPersonal,
                            as: "personalDetails",
                            attributes: ["id", "firstName", "lastName"]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    model: teacher,
                    as: "teacher",
                    include: [
                      {
                        model: masterUser,
                        as: "masterUserDetails",
                        attributes: ["id", "typeOfUser"],
                        include: [
                          {
                            model: masterUserPersonal,
                            as: "personalDetails",
                            attributes: ["id", "firstName", "lastName"]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          });
        })
        .then(fetchedStudentClassrooms => {
          resolve({
            message: "Classrooms have been retrieved",
            data: fetchedStudentClassrooms.classrooms
          });
        })
        .catch(error => {
          console.log("Error", error);
          reject({ message: "Something went wrong - " + error.toString() });
        });
    } else {
      teacher
        .findOne({
          where: {
            masterUserID: masterId
          }
        })
        .then(fetchedTeacher => {
          return teacher.findOne({
            where: {
              id: fetchedTeacher.id
            },
            include: [
              {
                model: classroom,
                as: "classrooms",
                include: [
                  {
                    model: student,
                    as: "students",
                    include: [
                      {
                        model: masterUser,
                        as: "masterUserDetails",
                        attributes: ["id", "typeOfUser"],
                        include: [
                          {
                            model: masterUserPersonal,
                            as: "personalDetails",
                            attributes: ["id", "firstName", "lastName"]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    model: teacher,
                    as: "teacher",
                    include: [
                      {
                        model: masterUser,
                        as: "masterUserDetails",
                        attributes: ["id", "typeOfUser"],
                        include: [
                          {
                            model: masterUserPersonal,
                            as: "personalDetails",
                            attributes: ["id", "firstName", "lastName"]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          });
        })
        .then(fetchedTeacherClassrooms => {
          resolve({
            message: "Classrooms retrieved",
            data: fetchedTeacherClassrooms.classrooms
          });
        })
        .catch(error => {
          reject({ message: "Something went wrong - " + error.toString() });
        });
    }
  });
};


module.exports = {
  joinClassroom,
  createNewClassroom,

  getClassrooms
};
