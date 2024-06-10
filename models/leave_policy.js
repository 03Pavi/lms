'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class leave_period_enum  {
    static leave_periods = {
      YEARLY: 'yearly',
      MONTHLY: 'monthly',
    }

    static get_available_periods() {
      const periods_key = Object.keys(leave_period_enum.leave_periods)
      return periods_key.map(key => (leave_period_enum.leave_periods[key]));
    }
  }


  class leave_policy extends Model {

    static associate(models) {
      
    }
  }
  leave_policy.init({
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notNull:{
          msg: 'Name is required.'
        },
        notEmpty: {
          msg: 'Name cannot be empty.',
        },
      },
    },
    credit: {
      type: DataTypes.INTEGER,
    },
    credit_period: {
      type: DataTypes.ENUM(leave_period_enum.get_available_periods()),
      allowNull: true,
      validate: {
        isIn: {
          args: [leave_period_enum.get_available_periods()],
          msg: 'Invalid credit period value.',
        },
      },
    },
    reset: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reset_period: {
      type: DataTypes.ENUM(leave_period_enum.get_available_periods()),
      allowNull: true,
      validate: {
        isIn: {
          args: [leave_period_enum.get_available_periods()],
          msg: 'Invalid reset period value.',
        },
      },
    },
    carry: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    carry_leaves: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'Invalid carry leaves value.',
        },
      }
    },
    encash: {
      type: DataTypes.BOOLEAN,
    },
    encash_leaves: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'Invalid encash leaves value.',
        },
      }
    },
    description: {
      type: DataTypes.STRING,
      notEmpty: {
        msg: 'Description cannot be empty.',
      },
    }
  }, {
    sequelize,
    modelName: 'leave_policy',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return {leave_policy, leave_period_enum};
};