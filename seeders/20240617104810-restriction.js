'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert('restrictions', [
        {
          uuid: uuidv4(),
          leave_policy_id: 1, // Use a valid leave_policy_id
          allow_exceed: false,
          exceed_limit: 'without_limit', // Make sure this is a valid value from exceed_limit_enum
          excess_as_lop: false,
          sandwich_leave: false,
          sandwich_weekend: 0,
          sandwich_holiday: 0,
          full_day: true,
          half_day: false,
          quarter_day: false,
          hourly: false,
          allow_past_requests: false,
          past_request_limit: 0,
          allow_future_requests: true,
          next_days_limit: 30,
          advance_days_limit: 90,
          admin_only: false,
          min_leave_per_request: 1,
          max_leave_per_request: 30,
          max_consecutive_days: 30,
          min_gap_between_requests: 7,
          max_requests_in_period: 12,
          period_type: 'year',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          uuid: uuidv4(),
          leave_policy_id: 2, // Use a valid leave_policy_id
          allow_exceed: false,
          exceed_limit: 'without_limit', // Make sure this is a valid value from exceed_limit_enum
          excess_as_lop: false,
          sandwich_leave: false,
          sandwich_weekend: 0,
          sandwich_holiday: 0,
          full_day: true,
          half_day: false,
          quarter_day: false,
          hourly: false,
          allow_past_requests: false,
          past_request_limit: 0,
          allow_future_requests: true,
          next_days_limit: 30,
          advance_days_limit: 90,
          admin_only: false,
          min_leave_per_request: 1,
          max_leave_per_request: 30,
          max_consecutive_days: 30,
          min_gap_between_requests: 7,
          max_requests_in_period: 12,
          period_type: 'year',
          created_at: new Date(),
          updated_at: new Date()
        }
      ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restrictions', null, {});
  }
};
