var express = require("express");
var router = express.Router();
var UserController = require("../controllers/users");

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

module.exports = router;
