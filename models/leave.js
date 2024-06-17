'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  
  class leave_type_enum  {
    static leave_type = {
      PAID : 'paid',
      UNPAID: 'unpaid',
    }
    static get_available_leave_types() {
      const leave_types_key = Object.keys(leave_type_enum.leave_type)
      return leave_types_key.map(key => (leave_type_enum.leave_type[key]));
    }
  }

  class leave_unit_enum  {
    static leave_unit = {
      HOUR : 'hour',
      DAY: 'day',
    }
    static get_available_leave_units() {
      const leave_units_key = Object.keys(leave_unit_enum.leave_unit)
      return leave_units_key.map(key => (leave_unit_enum.leave_unit[key]));
    }
  }

  class leave extends Model {

    static leave_leave_policy_association;
    static leaves_restrictions_association;

    static associate(models) {

      this.leaves_restrictions_association = leave.belongsToMany(models.restriction, {
        through: models.leave_restriction,
        foreignKey: 'restriction_id',
        otherKey:'restriction_id',
        as: 'restrictions' // alias for the association
      });

      this.leave_leave_policy_association = leave.hasOne(models.leave_policy, {
        foreignKey: "leave_id",
        as: "leave", // alias for the association
      });

      this.leave_restrictions_association = leave.belongsToMany(models.restriction, {
        through: models.clubbed_leave,
        foreignKey: "leave_id",
        anotherKey: "restriction_id",
        as: "restrictions",
      });

    }
  }
  leave.init({
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required.',
        },
        notEmpty: {
          msg: 'Name cannot be empty.',
        },
      }
    },
    organisation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'organisation id cannot be empty.',
        },
      },
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Code cannot be empty.',
        },
      }
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Color is required.',
        },
        notEmpty: {
          msg: 'Color cannot be empty.',
        },
      }
    },
    type: {
      type: DataTypes.ENUM(leave_type_enum.get_available_leave_types()),
      defaultValue: leave_type_enum.leave_type.PAID,
      allowNull: false,
      validate: {
        isIn: {
          args: [leave_type_enum.get_available_leave_types()],
          msg: 'Invalid leave type value.',
        },
      },
    },
    unit: {
      type:DataTypes.ENUM(leave_unit_enum.get_available_leave_units()),
      defaultValue: leave_unit_enum.leave_unit.DAY,
      allowNull: false,
      validate: {
        isIn: {
          args: [leave_unit_enum.get_available_leave_units()],
          msg: 'Invalid leave unit value.',
        },
      },
    },
    is_active: {
      type:DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'leave',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return { leave, leave_type_enum, leave_unit_enum };
};