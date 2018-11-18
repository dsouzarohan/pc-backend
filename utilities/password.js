const bcrypt = require("bcryptjs");

const hashPassword = password => {
  return bcrypt
    .genSalt(15)
    .then(salt => {
      return bcrypt.hash(password, salt);
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePasswords
};
