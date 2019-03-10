const jwt = require('jsonwebtoken');
const secrets = require("../config/secrets");

createToken = (email, id, type) => {
  const token = jwt.sign(
      {
        email: email,
        userID: id,
        type: type
      },
      secrets.bcryptSecret,
      {
        expiresIn: "1hr"
      }
  );
  return token;
};

module.exports = {
  createToken
};