'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class group_teacher extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  group_teacher.init({
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'group_teacher',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return { group_teacher };
};