const bcrypt = require("bcryptjs");

const hashPassword = password => {
  return bcrypt
    .genSalt(15)
    .then(salt => {
      console.log("Salt was created");
      console.log(salt);
      return bcrypt.hash(password, salt);
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

module.exports = {
  hashPassword
};
