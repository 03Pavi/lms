"use strict";
const { Model } = require("sequelize");
const { validate } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class session extends Model {

    static session_group_association;
    static session_attendance_association;
    
    static associate(models) {

      this.session_group_association = session.belongsTo(models.group, {
        foreignKey: "group_id",
        as: "group", // alias for the association
      });

      this.session_attendance_association = session.hasMany(models.attendance, {
        foreignKey: "session_id",
        as: "attendances", // alias for the association
      });

    }

  }
  session.init(
    {
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
      group_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'groups',
          key: 'id',
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Academic group id is required.'
          }
        }
      },
      real_date: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: {
            msg: 'Invalid real_date value.'
          },
        },
      },
      type: {
        type: DataTypes.ENUM('theoretical_practical', 'practical'),
        defaultValue: 'theoretical_practical',
        allowNull: true,
        validate: {
          isIn: {
            args: [['theoretical_practical', 'practical']],
            msg: 'Invalid type value.',
          },
        },
      },
      hours: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: 'Invalid hours value.',
          },
          min: {
            args: [1],
            msg: 'Hours must be a positive value.',
          },
        },
      },
      week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Week is required.'
          },
          isInt: {
            msg: 'Invalid week value.',
          },
        },
      },
      
    },
    {
      sequelize,
      modelName: "session",
      createdAt: 'created_at',
      updatedAt: 'updated_at',  
      hooks: {
        beforeFind: (query) => {
          if (query && query.where?.uuid) {
            if(!validate(query.where.uuid))
            throw Object.assign(new Error("UUID is not valid."), { name: "SequelizeValidationError" });
          }
        }
      }
    }
  );
  return { session };
};
