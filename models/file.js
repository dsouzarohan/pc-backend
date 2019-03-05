'use strict';
module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define('file', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  file.associate = function(models) {
    // associations can be defined here

    file.belongsTo(models.upload, {
      as: "upload",
      foreignKey: "uploadId"
    })

  };
  return file;
};