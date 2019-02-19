'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('answerVotes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      voteType: {
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
      questionAnswerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "questionAnswers",
          key: "id"
        }
      },
      voterId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "masterUsers",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('answerVotes');
  }
};