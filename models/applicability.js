'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applicability extends Model {

    static applicability_leave_policy_association;

    static associate(models) {
      this.applicability_leave_policy_association = applicability.belongsToMany(models.leave_policy, {
        through: models.policy_applicability,
        foreignKey: "applicability_id",
        otherKey: "leave_policy_id",
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
    criteria: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull:{
          msg: 'Applicability criteria is required.'
        },
        notEmpty: {
          msg: 'Applicability criteria cannot be empty.',
        },
      },
    },
    value: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        notEmpty: {
          msg: 'Applicability value cannot be empty.',
        },
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: 'User id value cannot be empty.',
        },
      },
    }
  }, {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ['criteria', 'value', 'user_id'],
        name: 'unique_applicability'
      }
    ],
    modelName: 'applicability',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return { applicability };
};