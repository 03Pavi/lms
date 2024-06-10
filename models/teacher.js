'use strict';
const { Model } = require('sequelize');
const { validate } = require('uuid');

module.exports = (sequelize, DataTypes) => {

  class teacher extends Model {

    static teacher_group_association;
    
    static associate(models) {

      this.teacher_group_association = teacher.belongsToMany(models.group, {
        through: models.group_teacher,
        foreignKey: 'teacher_id',
        otherKey: 'group_id',
        as: 'groups',
      });

    }
  }
  teacher.init({
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
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Full name is required.',
        },
        notEmpty: {
          msg: 'Full name cannot be empty.',
        },
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email is required.',
        },
        notEmpty: {
          msg: 'Email cannot be empty.',
        },
        isEmail: {
          msg: "Email is invalid."
        },
      }
    },

  }, {
    sequelize,
    modelName: 'teacher',
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    hooks: {
      beforeFind: (query) => {
        if (query && query.where?.email) {
          if (!validateEmail(query.where.email))
            throw Object.assign(new Error("Email is not valid."), { name: "SequelizeValidationError" });
        }

        if (query && query.where?.teacher_uuid) {
          if(!validate(query.where.teacher_uuid))
          throw Object.assign(new Error("UUID is not valid."), { name: "SequelizeValidationError" });
        }
      }
    }
  });

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return { teacher };
};