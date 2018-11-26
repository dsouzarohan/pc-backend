'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DiscussionPostComments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      discussionPostId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "DiscussionPosts",
          key: "id"
        }
      },
      commentedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "MasterUsers",
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
    return queryInterface.dropTable('DiscussionPostComments');
  }
};