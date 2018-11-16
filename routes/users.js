var express = require("express");
var router = express.Router();

var UserController = require("../controllers/users");

var passwordUtility = require('../utilities/password');

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

router.post("login", (req, res, next) => {
  const { credentials } = req.body;

  UserController.getCredential(credentials.email)
      .then(userCredentials => {
          if(!userCredentials){
              return res
                  .status(401)
                  .json({
                      error: "Email address does not exist"
                  });
          }

          return passwordUtility.comparePasswords(credentials.password, userCredentials.password);
      })
      .then( result => {
          if(!result){
              return res.json({
                  error: "Incorrect password"
              });

          }



      })
});

module.exports = router;
