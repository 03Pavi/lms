'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

  class exceed_limit_enum {
    static exceed_limit = {
        UNTIL_YEAR_END: 'until_year_end',
        WITHOUT_LIMIT: 'without_limit',
    };
    static get_available_exceed_limits() {
        return Object.values(exceed_limit_enum.exceed_limit);
    }
  }

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

  class restriction extends Model {

    static restriction_leave_policy_association;
    static restriction_leaves_association;

    static associate(models) {

      this.restriction_leaves_association = restriction.belongsToMany(models.leave, {
        through: models.clubbed_leave,
        foreignKey: "restriction_id",
        anotherKey: "leave_id",
        as: "clubbed_leaves",
      });

      this.restriction_leave_policy_association = restriction.belongsTo(models.leave_policy, {
        foreignKey: "leave_policy_id",
        as: "leave_policy", 
      });

    }
  }

  restriction.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'UUID cannot be empty.',
        },
      },
    },
    leave_policy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
          model: 'leave_policies',
          key: 'id'
      },
      validate: {
        notNull: {
          msg: 'Leave id is required.'
        },
      }
    },
    allow_exceed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      validate: {
       
      }
    },
    exceed_limit: {
      type: DataTypes.ENUM(exceed_limit_enum.get_available_exceed_limits()),
      defaultValue: exceed_limit_enum.exceed_limit.WITHOUT_LIMIT,
      allowNull: false,
      validate: {
          isIn: {
              args: [exceed_limit_enum.get_available_exceed_limits()],
              msg: 'Invalid exceed_limit value.',
          },
      },
    },
    excess_as_lop: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    sandwich_leave: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    sandwich_weekend: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sandwich_holiday: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
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
        type: DataTypes.ENUM(period_type_enum.get_available_periods()),
        defaultValue: period_type_enum.period_types.WEEK,
        allowNull: false,
        validate: {
            isIn: {
                args: [period_type_enum.get_available_periods()],
                msg: 'Invalid period type.',
            },
        },
    }
  },
  {
    sequelize,
    modelName: 'restriction',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return { restriction, exceed_limit_enum, period_type_enum };
};
