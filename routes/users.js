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
    .then(user => {
      console.log(user);
      res.json({
        message: "Got ya fuckin data biatch"
      });
    })
    .catch(error => {
      console.log("LLG");
      res.json({
        message: "Scene hogaya bro",
        error
      });
    });

  //todo: perform backend validation here and with every form
});

module.exports = router;
