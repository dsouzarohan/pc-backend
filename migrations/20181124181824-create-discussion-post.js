'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DiscussionPosts', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
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
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Discussions",
          key: "id"
        }
      },
      postedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "MasterUsers",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DiscussionPosts');
  }
};