const db = require("../models");

const { masterUser, student, masterUserPersonal, announcement, teacher, sequelize, classroom } = db;

classroom.findOne({
  where: {
    id: 3
  },
  include: [
    {
      association: "students",
      include: [
        {
          model: masterUser,
          as: "masterUserDetails",
          attributes: ["id","typeOfUser"],
          include: [
              {
                model: masterUserPersonal,
                as: "personalDetails",
                attributes: ["id","firstName","lastName"]
              }
          ]
        }
      ]
    }
  ]
}).then( fetchedClassroom => {
  console.log(fetchedClassroom.get({plain: true}));
});