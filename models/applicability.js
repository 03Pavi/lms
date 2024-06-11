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
      this.group_student_association = leavy_policy.belongsToMany(models.leavy_policy, {
        through: models.policy_applicability,
        foreignKey: "leavy_policy_id",
        otherKey: "applicability_id",
        as: "applicability", // alias for the association
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