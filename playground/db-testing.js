const db = require("../models");

const {
  masterUser,
  student,
  masterUserPersonal,
  announcement,
  teacher,
  sequelize,
  Sequelize,
  classroom,
    discussion
} = db;

discussion.findAll().then( discussions => {

  for(let i = 0; i < discussions.length; i++){
    console.log(discussions[i].get({plain: true}))
  }

});
