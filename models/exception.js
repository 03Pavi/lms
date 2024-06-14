'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class exception extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.exception_leave_policy_association = exception.belongsToMany(models.leave_policy, {
        through: models.policy_exception,
        foreignKey: "exception_id",
        otherKey: "leave_policy_id",
        as: "leave_policies", // alias for the association
      });
    }
  }
  exception.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    criteria: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull:{
          msg: 'Exception criteria is required.'
        },
        notEmpty: {
          msg: 'Exception criteria cannot be empty.',
        },
      },
    },
    value: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Exception value cannot be empty.',
        },
      },
    }
  }, {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ['criteria', 'value'],
        name: 'unique_exception'
      }
    ],
    modelName: 'exception',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return { exception };
};