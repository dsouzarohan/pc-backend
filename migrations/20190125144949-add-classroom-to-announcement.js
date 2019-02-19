"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "announcements",
        "classroomId",
        Sequelize.INTEGER
      ),
      queryInterface.addConstraint("announcements", ["classroomId"], {
        type: "foreign key",
        name: "fk_announcements_classroomId",
        references: {
          table: "classrooms",
          field: "id"
        }
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint(
        "announcements",
        "fk_announcements_classroomId"
      ),
      queryInterface.removeColumn("announcements", "classroomId")
    ]);
  }
};
