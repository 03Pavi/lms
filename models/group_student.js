'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class group_student extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  group_student.init({
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'group_student',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return { group_student };
};