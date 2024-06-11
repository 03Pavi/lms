'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applicability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.applicability_leavy_policy_association = applicability.belongsToMany(models.leavy_policy, {
        through: models.policy_applicability,
        foreignKey: "applicability_id",
        otherKey: "leavy_policy_id",
        as: "leave_policies", // alias for the association
      });
    }
  }
  applicability.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'UUID cannot be empty.',
        },
      },
    },
    criteria: {
      type: DataTypes.ENUM(leave_type_enum.get_available_applicable_criteria()),
      defaultValue: leave_type_enum.leave_type.PAID,
      allowNull: true,
      validate: {
        isIn: {
          args: [DataTypes.ENUM(leave_type_enum.get_available_applicable_criteria())],
          msg: 'Invalid leave criteria value.',
        },
      },
  },
  value: {
    type: DataTypes.ENUM(leave_type_enum.get_available_applicable_values()),
      defaultValue: leave_type_enum.leave_type.PAID,
      allowNull: true,
      validate: {
        isIn: {
          args: [DataTypes.ENUM(leave_type_enum.get_available_applicable_values())],
          msg: 'Invalid leave type value.',
        },
      },
  },
  condition: {
    type: DataTypes.ENUM(leave_type_enum.get_available_applicable_conditions()),
    defaultValue: leave_type_enum.leave_type.PAID,
    allowNull: true,
    validate: {
      isIn: {
        args: [DataTypes.ENUM(leave_type_enum.get_available_leave_types())],
        msg: 'Invalid leave type value.',
      },
    },
  },
  }, {
    sequelize,
    modelName: 'applicability',
  });
  return applicability;
};