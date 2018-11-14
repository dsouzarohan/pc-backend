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
        return masterUser.createMasterUserContact({
          phoneNumber: contact.mobileNumber,
          alternateNumber: contact.alternateNumber,
          email: contact.email,
          address: contact.address

        });
      })
      .then(createdMasterUserContact => {
        if (type.type === "Student") {
          return masterUser.createStudent({
            stream: "",
            uid: 123456
          });
        }

        return masterUser.createTeacher({
          uid: 123456
        });
      })
      .then(createdStudentOrTeacher => {
        return masterUser.createUserCredential({
          email: credentials.email,
          password: credentials.password
        });
      });
  });
};

module.exports = {
  createUser
};
