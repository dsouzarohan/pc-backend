var express = require("express");
var jwt = require("jsonwebtoken");

var router = express.Router();

var UserController = require("../controllers/users");

var passwordUtility = require("../utilities/password");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res, next) => {
  const user = req.body;

  UserController.createUser(user)
    .then(result => {
      // console.log(result);
      res.json({
        message: "Record has been added successfully"
      });
    })
    .catch(error => {
      // console.log(error);

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
  console.log(req.body);

  const { credentials } = req.body;

  console.log(credentials);

  let fetchedUserCredentials;

  UserController.getCredential(credentials.email)
    .then(userCredentials => {
      console.log(userCredentials);

      if (!userCredentials)
        return res.status(401).json({ error: "Email address does not exist" });

      fetchedUserCredentials = userCredentials;

      return passwordUtility.comparePasswords(
        credentials.password,
        fetchedUserCredentials.password
      );
    })
    .then(result => {
      if (!result) return res.json({ error: "Incorrect password" });

      const token = jwt.sign(
        {
          email: fetchedUserCredentials.email,
          userID: fetchedUserCredentials.id
        },
        "MYSECRETTHATWILLBECHANGEDSOON",
        {
          expiresIn: "1hr"
        }
      );

      console.log(token);

      res.json({
        token
      });
    })
    .catch(error => {
      console.log(error);

      return res.json({
        error
      });
    });
});

module.exports = router;
