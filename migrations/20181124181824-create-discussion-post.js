'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('discussionPosts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      body: {
        type: Sequelize.TEXT,
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
      discussionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "discussions",
          key: "id"
        }
      },
      postedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "masterUsers",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('discussionPosts');
  }
};