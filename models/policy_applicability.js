'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class policy_applicability extends Model {

    static associate(models) {
      
    }
  }
  policy_applicability.init({
    applicability_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'applicabilities',
        key: 'id'
      }
    },
    leave_policy_id: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'leave_policies',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'policy_applicability',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return { policy_applicability };
};