var express = require("express");

var router = express.Router();

var UserController = require("../controllers/users");

var passwordUtility = require("../utilities/password");
var tokenUtility = require("../utilities/token");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res, next) => {
  const user = req.body;

  UserController.createUser(user)
    .then(result => {

      console.log(result);

      return res.status(200).json({
        message: "Record added successfully"
      });
    })
    .catch(error => {

      res.json({
        message:
          "Record could not be added. Check out the error property for more.",
        error
      });
    });

  //todo: perform backend validation here and with every form
});

router.get("/email/:email", (req, res, next) => {
  const email = req.params["email"];

  UserController.userEmailExists(email)
    .then(credential => {
      if (credential) {
        return res.json({
          emailExists: true
        });
      }
      res.json({
        emailExists: false
      });
    })
    .catch(error => {
      res.json({
        error
      });
    });
});

router.post("/login", (req, res, next) => {

  const { credentials } = req.body;


  let fetchedUserCredentials;

  UserController.getCredential(credentials.email)
    .then(userCredentials => {


      if (!userCredentials) throw new Error('Email address does not exist');

      fetchedUserCredentials = userCredentials;

      return passwordUtility.comparePasswords(
        credentials.password,
        fetchedUserCredentials.password
      );
    })
    .then(result => {

      if (!result) throw new Error('Incorrect password');

      const token = tokenUtility.createToken(fetchedUserCredentials.email, fetchedUserCredentials.id);

      res.json({
        token,
        expiresIn: 3600
      });
    })
    .catch(error => {

      return res.status(401).json({
        message: error.message
      });
    });
});

module.exports = router;
