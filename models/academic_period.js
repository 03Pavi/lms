'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class academic_period extends Model {

    static parent_child_academic_period_association;
    static child_parent_academic_period_association;
    static academic_period_group_association;

    static associate(models) {

      this.academic_period_group_association = academic_period.hasMany(models.group, {
        foreignKey: "academic_period_id",
        as: "groups"
      });

      // Self-referencing association for parent_period
      this.parent_child_academic_period_association = academic_period.belongsTo(models.academic_period, {
        foreignKey: 'parent_period_id',
        as: 'parent_academic_period',
      });

      // Self-referencing association for child_periods
      this.child_parent_academic_period_association = academic_period.hasMany(models.academic_period, {
        foreignKey: 'parent_period_id',
        as: 'child_academic_periods',
      });

    }

  }
  academic_period.init({
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
        notNull: {
          msg: 'UUID is required.'
        },
        notEmpty: {
          msg: 'UUID cannot be empty.',
        },
      },
    },
    name: {
      type: DataTypes.STRING(100),
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty.',
        },
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Start date is required.'
        },
        isDate: {
          msg: 'Invalid start_date value.'
        }
      },
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'End date is required.'
        },
        isDate: {
          msg: 'Invalid end_date value.'
        }
      },
    },
    type: {
      type: DataTypes.ENUM('annual', 'biannual', 'infinite'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['annual', 'biannual', 'infinite']],
          msg: 'Invalid type value.',
        },
        notNull: {
          msg: 'Type is required.'
        },
      },
    },
    parent_period_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'academic_periods',
        key: 'id',
      },
    }
  }, {
    sequelize,
    modelName: 'academic_period',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return { academic_period };
};