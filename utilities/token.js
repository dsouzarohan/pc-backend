const jwt = require('jsonwebtoken');

createToken = (email, id) => {
  const token = jwt.sign(
      {
        email: email,
        userID: id
      },
      "MYSECRETTHATWILLBECHANGEDSOON",
      {
        expiresIn: "1hr"
      }
  );
  return token;
};

module.exports = {
  createToken
};