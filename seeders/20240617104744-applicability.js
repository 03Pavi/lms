'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('applicabilities', [
      {
        criteria: 'Location',
        value: 'India',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        criteria: 'Department',
        value: 'Engineering',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        criteria: 'Role',
        value: 'Manager',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        criteria: 'Employment Type',
        value: 'Full-Time',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('applicabilities', null, {});
  }
};
