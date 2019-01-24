'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('discussionPostComments', {
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
      discussionPostId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "discussionPosts",
          key: "id"
        }
      },
      commentedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "masterUsers",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('discussionPostComments');
  }
};