'use strict';

const { attendance, attendance_status_enum } = require("../models")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('attendances', 'previous_status', {
      type: Sequelize.ENUM(attendance_status_enum.get_available_statuses()),
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE attendances
      SET previous_status = '${attendance_status_enum.attendance_statuses.ABSENT}'
      WHERE status = '${attendance_status_enum.attendance_statuses.JUSTIFIED}';
    `);

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('attendances', 'previous_status');
  }
};
