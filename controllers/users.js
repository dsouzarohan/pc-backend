const passwordUtility = require("../utilities/password");

const db = require("../models");
const {
  Sequelize,
  sequelize,

  MasterUser,
  MasterUserContact,
  MasterUserPersonal,
  UserCredential,
  Student,
  Teacher
} = db;

const { Op } = Sequelize;

//todo: change all return values of controllers to custom promises

createUser = user => {
  let masterUser;

  let { type, personal, contact, credentials } = user;

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
            alternateNumber:
              contact.alternateNumber === "" ? null : contact.alternateNumber,
            email: contact.email,
            address: contact.address
          },
          { transaction }
        );
      })
      .then(createdMasterUserContact => {
        if (type.type === "Student") {
          return masterUser.createStudent(
            {
              stream: type.stream,
              uid: type.uid
            },
            { transaction }
          );
        }

        return masterUser.createTeacher(
          {
            uid: type.uid
          },
          { transaction }
        );
      })
      .then(createdStudentOrTeacher => {
        return passwordUtility.hashPassword(credentials.password);
      })
      .then(hashedPassword => {
        return masterUser.createUserCredential(
          {
            email: credentials.email,
            password: hashedPassword
          },
          { transaction }
        );
      })
      .catch(error => {
        error;
        ("In transaction catch");
        return Promise.reject(error);
      });
  });
};

getCredential = email => {
  return UserCredential.findOne({
    where: {
      email
    },
    include: [MasterUser]
  });
};

//unique key validators

userEmailExists = email => {
  return MasterUserContact.findOne({
    where: {
      email
    }
  });
};

phoneNumberExists = number => {
  return MasterUserContact.findOne({
    where: {
      [Op.or]: [
        {
          phoneNumber: number
        },
        {
          alternateNumber: number
        }
      ]
    }
  });
};

uidExists = (uid, typeOfUser) => {
  if (typeOfUser === "Student") {
    return Student.findOne({
      where: {
        uid
      }
    });
  } else {
    return Teacher.findOne({
      where: {
        uid
      }
    });
  }
};

//component data controllers

getProfile = userID => {
  return MasterUser.findOne({
    where: {
      id: userID
    },
    include: [MasterUserPersonal, MasterUserContact]
  });
};

//todo: remove controller once personal details eager loading is done
getPersonalDetails = userID => {
  return new Promise((resolve, reject) => {
    Teacher.findOne({
      where: {
        id: userID
        //have my local history till here biatch
      }
    })
      .then(teacher => {
        if (!teacher) {
          reject({ message: "Teacher does not exist" });
        } else {
          return teacher.getMasterUser();
        }
      })
      .then(masterUser => {
        if (!masterUser) {
          reject({ message: "User does not exist" });
        } else {
          return masterUser.getMasterUserPersonal();
        }
      })
      .then(userPersonalDetails => {
        if (!userPersonalDetails) {
          reject({ message: "Details do not exist" });
        } else {
          resolve({
            message: "User personal details found",
            personalDetails: userPersonalDetails
          });
        }
      });
  });
};

// TODO: add GET routes for all async validators

module.exports = {
  createUser,
  userEmailExists,
  phoneNumberExists,
  uidExists,
  getCredential,
  getProfile,
  getPersonalDetails
};
