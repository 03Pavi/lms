'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class student extends Model {

    static student_group_association;
    static student_attendance_association;
    
    static associate(models) {
      // define association here
      this.student_group_association = student.belongsToMany(models.group, {
        through: models.group_student,
        foreignKey: 'student_id',
        otherKey: 'group_id',
        as: 'groups',
      });

      this.student_attendance_association = student.hasMany(models.attendance, {
        foreignKey: "student_id",
        as: "attendances", // alias for the association
      });
    }
  }
  student.init({
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
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First name is required.'
        },
        notEmpty: {
          msg: 'First name cannot be empty.'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'last name is required.'
        },
        notEmpty: {
          msg: 'last name cannot be empty.'
        }
      }
    },
    dni: {
      type: DataTypes.STRING(36),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'DNI is required.'
        },
        notEmpty: {
          msg: 'DNI cannot be empty.'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'student',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return { student };
};