const db = require("../models");
const {
  Sequelize,
  sequelize,

  MasterUser
} = db;

createUser = user => {
  let masterUser;

  let { type, personal, contact, credentials } = user;

  console.log(user);

  return sequelize.transaction(transaction => {
    return MasterUser.create(
      {
        typeOfUser: type.type
      },
      { transaction }
    )
      .then(createdMasterUser => {
        masterUser = createdMasterUser;

        return masterUser.createMasterUserPersonal(
          {
            firstName: personal.firstName,
            lastName: personal.lastName,
            middleName: personal.middleName,
            dateOfBirth: personal.dateOfBirth,
            gender: personal.gender
          },
          { transaction }
        );
      })
      .then(createdMasterUserPersonal => {
        return masterUser.createMasterUserContact(
          {
            phoneNumber: contact.mobileNumber,
            alternateNumber: contact.alternateNumber,
            email: contact.email,
            address: contact.address
          },
          { transaction }
        );
      })
      .then(createdMasterUserContact => {
        if (type.type === "Student") {
          console.log("Creating");

          return masterUser.createStudent(
            {
              stream: "",
              uid: 123456
            },
            { transaction }
          );
        }

        return masterUser.createTeacher(
          {
            uid: 123456
          },
          { transaction }
        );
      })
      .then(createdStudentOrTeacher => {
        return masterUser.createUserCredential(
          {
            email: credentials.email,
            password: credentials.password
          },
          { transaction }
        );
      });
  });
};

module.exports = {
  createUser
};
