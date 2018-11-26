const jwt = require('jsonwebtoken');

createToken = (email, id, type) => {
  const token = jwt.sign(
      {
        email: email,
        userID: id,
        type: type
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