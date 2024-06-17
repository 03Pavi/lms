'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class leave_restriction extends Model {

    static associate(models) {
      
    }
  }
  leave_restriction.init({
    leave_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'leaves',
        key: 'id'
      }
    },
    restriction_id: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'restrictions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'policy_applicability',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return { leave_restriction };
};