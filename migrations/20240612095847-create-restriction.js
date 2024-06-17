'use strict';
const {exceed_limit_enum, period_type_enum} = require('../models');

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
        type: Sequelize.ENUM(exceed_limit_enum.get_available_exceed_limits()),
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
      full_day:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      half_day:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      quarter_day:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      hourly:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      allow_past_requests: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      past_request_limit: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      allow_future_requests: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
      },
      next_days_limit: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      advance_days_limit: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      admin_only: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
      },
      min_leave_per_request: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      max_leave_per_request: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      max_consecutive_days: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      min_gap_between_requests: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      max_requests_in_period: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      period_type: {
          type: Sequelize.ENUM(period_type_enum.get_available_periods()),
          defaultValue: period_type_enum.period_types.WEEK,
          allowNull: false,
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