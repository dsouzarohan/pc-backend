const db = require('../models');
const {
    Sequelize,
    sequelize,

    MasterUser

} = db;

createUser = ( user ) => {
    return MasterUser.create({
        typeOfUser: user.type.type
    });
};

module.exports = {
    createUser
};