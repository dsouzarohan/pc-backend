'use strict';

module.exports = (sequelize, DataTypes) => {
  const announcement = sequelize.define('announcement', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  announcement.associate = function(models) {
    // associations can be defined here

    announcement.belongsTo(models.teacher, {
      foreignKey: "createdBy",
      as: "creator"
    });

  };
  return announcement;
};