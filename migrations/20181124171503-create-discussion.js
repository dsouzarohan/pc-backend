'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Discussions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      topic: {
        type: Sequelize.STRING,
        allowNull: false
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      startedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "MasterUsers",
          key: "id"
        }
      },
      classroomId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Classrooms",
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
    return queryInterface.dropTable('Discussions');
  }
};