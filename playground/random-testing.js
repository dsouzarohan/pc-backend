const bcrypt = require("bcryptjs");

bcrypt.genSalt(10)
    .then( salt => {
      console.log(salt);


});