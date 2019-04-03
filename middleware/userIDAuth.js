const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

module.exports = options => {
  //opts is either set to the options object passed or an empty object if not passed
  let opts = options || {};

  let { authorizationOnlyTo } = opts;

  if (!authorizationOnlyTo) {
    authorizationOnlyTo = null;
  }

  return (req, res, next) => {
    const tokenHeader = req.get("X-Authorization");

    try {
      const token = tokenHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, secrets.bcryptSecret);

      console.log("@UserIDMiddleware#Decoded token", decodedToken);

      if (!decodedToken) {
        res.status(401).json({
          message: "You are unauthorized to access this resource"
        });
      } else {
        if (
          authorizationOnlyTo !== null &&
          authorizationOnlyTo !== decodedToken.type
        ) {
          res.status(401).json({
            message: `User type '${
              decodedToken.type
            }' has no access to this resource`
          });
        } else {
          req.userData = {
            email: decodedToken.email,
            userID: decodedToken.userID,
            userType: decodedToken.type
          };
          next();
        }
      }
    } catch (error) {
      res.json({
        error
      });
    }
  };
};
