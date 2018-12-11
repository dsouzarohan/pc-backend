'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });

    */

    return queryInterface.changeColumn('StudentClassrooms','id',{
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true
    });

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return queryInterface.changeColumn('StudentClassrooms','id',{
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      autoIncrement: false
    });

  }
};
