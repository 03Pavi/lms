'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

  class exceed_limit_enum {
    static exceed_limit = {
        UNTIL_YEAR_END: 'until year end',
        WITHOUT_LIMIT: 'without limit',
    };
    static get_available_exceeded_limits() {
        return Object.values(exceed_limit_enum.exceed_limit);
    }
  }

  class restriction extends Model {

    static restriction_leave_policy_association;
    static restriction_leaves_association;

    static associate(models) {

      this.restriction_leaves_association = restriction.hasMany(models.leave, {
        foreignKey: "restriction_id",
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
        notNull: {
          msg: 'allow exceeded check id is required.'
        },
      }
    },
    exceed_limit: {
      type: DataTypes.ENUM(exceed_limit_enum.get_available_exceeded_limits()),
      defaultValue: exceed_limit_enum.exceeded_limit.WITHOUT_LIMIT,
      allowNull: true,
      validate: {
          isIn: {
              args: [exceed_limit_enum.get_available_exceeded_limits],
              msg: 'Invalid exceeded_limit value.',
          },
      },
    },
    excess_as_lop: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      validate: {
          notNull: {
            msg: 'excess as lop id is required.'
          },
      }
    },
    sandwich_leave: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      validate: {
          notNull: {
            msg: 'excess as lop id is required.'
          },
      }
    },
    sandwich_weekend: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sandwich_holiday: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'restriction',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return { restriction, exceed_limit_enum };
};
