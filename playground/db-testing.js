const db = require("../models");

const {
  Sequelize, sequelize,
  Teacher, Classroom, MasterUser, Student,
  Discussion, DiscussionPost, DiscussionPostComment
} = db;

const User = sequelize.define('user', {
  name: Sequelize.STRING
});
const UserRole  = sequelize.define('userRole', {
  roleName: Sequelize.STRING
});

UserRole.hasMany(User, {as: 'role'});


UserRole.sync({
  force: true
});


User.sync({
  force: true
});
