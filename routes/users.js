var express = require("express");

var router = express.Router();

var UserController = require("../controllers/users");

var passwordUtility = require("../utilities/password");
var tokenUtility = require("../utilities/token");
var randomer = require("../utilities/random");

var userIDAuth = require("../middleware/userIDAuth");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.json({
    randomString: randomer.randomString()
  });
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
      res.status(400).json({
        message:
          "Something went wrong - "+error.toString()
      });
    });

  //todo: perform backend validation here and with every form
});

router.post("/signin", (req, res, next) => {
  const { credentials } = req.body;

  let fetchedUserCredentials;
  let fetchedMasterUser;

  UserController.getCredential(credentials.email)
    .then(userCredentials => {
      if (!userCredentials)
        throw new Error("Woops! This email address does not exist");

      fetchedUserCredentials = userCredentials;
      fetchedMasterUser = userCredentials.MasterUser;

      return passwordUtility.comparePasswords(
        credentials.password,
        fetchedUserCredentials.password
      );
    })
    .then(result => {
      if (!result) throw new Error("Password entered is incorrect");

      const token = tokenUtility.createToken(
        fetchedUserCredentials.email,
        fetchedUserCredentials.masterUserId,
        fetchedMasterUser.typeOfUser
      );

      res.json({
        token,
        expiresIn: 3600,
        userID: fetchedUserCredentials.masterUserId,
        type: fetchedMasterUser.typeOfUser
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
      res.status(400).send({
        message: "Something went wrong - "+error.toString()
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
    res.status(400).send({
      message: "Something went wrong - "+error.toString()
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
    res.status(400).send({
      message: "Something went wrong - "+error.toString()
    });
    });
});

//User data routes

router.get("/profile/:id", userIDAuth(), (req, res) => {
  const id = req.params["id"];
  const jwtID = req.userData.userID;

  console.log("Route called", id, jwtID);

  if (id != jwtID) {
    return res.status(401).json({
      message: "Unauthorized access"
    });
  } else {
    UserController.getProfile(id)
      .then(profile => {
        res.json({
          message: "Profile retrieved",
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
