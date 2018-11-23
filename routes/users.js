var express = require("express");

var router = express.Router();

var UserController = require("../controllers/users");

var passwordUtility = require("../utilities/password");
var tokenUtility = require("../utilities/token");

var userIDAuth = require('../middleware/userIDAuth');

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

//user signin or signup

router.post("/signup", (req, res, next) => {
  const user = req.body;

  UserController.createUser(user)
    .then(result => {

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

router.post("/signin", (req, res, next) => {
  const { credentials } = req.body;

  let fetchedUserCredentials;

  UserController.getCredential(credentials.email)
    .then(userCredentials => {
      if (!userCredentials) throw new Error("Email address does not exist");

      fetchedUserCredentials = userCredentials;

      return passwordUtility.comparePasswords(
        credentials.password,
        fetchedUserCredentials.password
      );
    })
    .then(result => {
      if (!result) throw new Error("Incorrect password");

      const token = tokenUtility.createToken(
        fetchedUserCredentials.email,
        fetchedUserCredentials.id
      );

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

//Async validation routes

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

router.get("/number/:number", (req, res, next) => {
  const number = req.params["number"];

  UserController.phoneNumberExists(number)
    .then(fetchedNumber => {
      if (fetchedNumber) {
        res.json({
          numberExists: true
        });
      } else {
        res.json({
          numberExists: false
        });
      }
    })
    .catch(error => {
      res.json({
        error
      });
    });
});

router.get("/uid/:uid/type/:type", (req, res, next) => {
  const uid = req.params["uid"];
  const typeOfUser = req.params["type"];

  UserController.uidExists(uid, typeOfUser)
    .then(fetchedUid => {
      if (fetchedUid) {
        res.json({
          uidExists: true
        });
      } else {
        res.json({
          uidExists: false
        });
      }
    })
    .catch(error => {
      res.json({
        error
      });
    });
});

//User data routes

router.get(
    "/profile/:id",
    userIDAuth,
    (req, res) => {
  const id = req.params["id"];
  const jwtID = req.userData.userID;

  
  

  // todo: convert both to numbers and compare

  if(id != jwtID) {
    return res.status(401).json({
      message: "Unauthorized access"
    });
  } else {
    UserController.getProfile(id)
    .then(profile => {
      res.json({
        profile
      });

      

    })
    .catch(error => {
      res.status(401).json({
        error
      });
    });
  }
});

module.exports = router;
