const passwordUtility = require("../utilities/password");

const db = require("../models");
const {
  Sequelize,
  sequelize,

  masterUser,
  masterUserContact,
  masterUserPersonal,
  userCredential,
  student,
  teacher
} = db;

const { Op } = Sequelize;

//todo: change all return values of controllers to custom promises

createUser = user => {
  let createdMasterUser;

  let { type, personal, contact, credentials } = user;

  return sequelize.transaction(transaction => {
    return masterUser.create(
      {
        typeOfUser: type.type
      },
      { transaction }
    )
      .then( newMasterUser => {
        createdMasterUser = newMasterUser;

        return createdMasterUser.createPersonalDetails(
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
      .then(newPersonalDetails => {
        return createdMasterUser.createContactDetails(
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
      .then(createdContactDetails => {
        if (type.type === "Student") {
          return createdMasterUser.createStudent(
            {
              stream: type.stream,
              uid: type.uid
            },
            { transaction }
          );
        }

        return createdMasterUser.createTeacher(
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
        return createdMasterUser.createUserCredential(
          {
            email: credentials.email,
            password: hashedPassword
          },
          { transaction }
        );
      })
      .catch(error => {

        console.log("In transaction catch", error);
        return Promise.reject(error);
      });
  });
};

getCredential = email => {
  return userCredential.findOne({
    where: {
      email
    },
    include: [{
      model: masterUser,
      as: "masterUserDetails"
    }]
  });
};

//unique key validators

userEmailExists = email => {
  return masterUserContact.findOne({
    where: {
      email
    }
  });
};

phoneNumberExists = number => {
  return masterUserContact.findOne({
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
    return student.findOne({
      where: {
        uid
      }
    });
  } else {
    return teacher.findOne({
      where: {
        uid
      }
    });
  }
};

//component data controllers

getProfile = userID => {
  return masterUser.findOne({
    where: {
      id: userID
    },
    include: [{
      model: masterUserPersonal,
      as: "personalDetails"
    }, {
      model: masterUserContact,
      as: "contactDetails"
    }]
  });
};

//todo: remove controller once personal details eager loading is done
getPersonalDetails = userID => {
  return new Promise((resolve, reject) => {
    teacher.findOne({
      where: {
        id: userID
        //have my local history till here biatch
      }
    })
      .then(teacher => {
        if (!teacher) {
          reject({ message: "Teacher does not exist" });
        } else {
          return teacher.getMasterUserDetails();
        }
      })
      .then(masterUser => {
        if (!masterUser) {
          reject({ message: "User does not exist" });
        } else {
          return masterUser.getPersonalDetails();
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
