'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class period_type_enum {
    static period_types = {
        WEEK: 'week',
        MONTH: 'month',
        YEAR: 'year',
        ACCRUAL_PERIOD: 'accrual period',
        JOB_TENURE: 'job tenure',
    };

    static get_available_periods() {
        return Object.values(period_type_enum.period_types);
    }
  }

  class record_restriction extends Model {

    static associate(models) {
      
    }
  }

  record_restriction.init({
    allow_past_requests: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    past_request_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    allow_future_requests: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    next_days_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    advance_days_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    admin_only: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    min_leave_per_request: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    max_leave_per_request: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    max_consecutive_days: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    min_gap_between_requests: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    max_requests_in_period: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    period_type: {
        type: DataTypes.ENUM(period_type_enum.get_available_period_types()),
        defaultValue: period_type_enum.period_types.WEEK,
        allowNull: false,
        validate: {
            isIn: {
                args: [period_type_enum.get_available_period_types()],
                msg: 'Invalid period type.',
            },
        },
    }
  }, {
    sequelize,
    modelName: 'record_restriction',
  });
  return { record_restriction };
};