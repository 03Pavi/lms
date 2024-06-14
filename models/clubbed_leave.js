'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class clubbed_leave extends Model {
    static associate(models) {
      // define association here
    }
  }
  clubbed_leave.init({
    restriction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'restriction id is required.'
        }
      }
    },
    leave_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'leave id is required.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'clubbed_leave',
  });
  return { clubbed_leave };
};