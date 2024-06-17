'use strict';
const { DataTypes } = require('sequelize');
const {exceed_limit_enum} = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('restrictions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      leave_policy_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'leave_policies',
          key: 'id'
        }
      },
      allow_exceed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      exceed_limit: {
        type: Sequelize.ENUM(exceed_limit_enum.get_available_exceeded_limits()),
        defaultValue: exceed_limit_enum.exceed_limit.WITHOUT_LIMIT,
        allowNull: true,
      },
      excess_as_lop: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      sandwich_leave: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      sandwich_weekend: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sandwich_holiday: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        field: "created_at",
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        field: "updated_at",
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('restrictions');
  }
};