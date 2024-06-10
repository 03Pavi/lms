"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class academic_element extends Model {

    static academic_element_group_association;
    
    static associate(models) {
      this.academic_element_group_association = academic_element.hasMany(models.group, {
        foreignKey: "academic_element_id",
        as: "groups",
      });
    }
  }
  academic_element.init({
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
          msg: 'UUID cannot be empty.'
        },
        notNull: {
          msg: 'UUID is required.'
        }
      },
    },
    type: {
      type: DataTypes.ENUM('subject_version'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['subject_version']],
          msg: 'Invalid type value.',
        },
        notNull: {
          msg: 'Type is required.'
        },
      }
    },
    abbr: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Abbr cannot be empty.'
        },
        notNull: {
          msg: 'Abbr is required.'
        }
      },
    },
    version: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Version cannot be empty.'
        },
        notNull: {
          msg: 'Version is required.'
        }
      },
    },
    name: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty.'
        },
        notNull: {
          msg: 'Name is required.'
        }
      },
    }
  }, {
    sequelize,
    modelName: "academic_element",
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return { academic_element };
};