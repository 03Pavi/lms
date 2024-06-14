'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class policy_exception extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  policy_exception.init({
    exception_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'exceptions',
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
    modelName: 'policy_exception',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return {policy_exception};
};