'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('answerComments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      commenterId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "masterUsers",
          key: "id"
        }
      },
      answerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "questionAnswers",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('answerComments');
  }
};