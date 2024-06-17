'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('leaves', [
      {
        uuid: uuidv4(),
        name: 'Annual Leave',
        organisation_id: uuidv4(),
        code: 'AL',
        color: '#FF5733',
        type: 'paid',
        unit: 'day',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        name: 'Sick Leave',
        organisation_id: uuidv4(),
        code: 'SL',
        color: '#33FF57',
        type: 'unpaid',
        unit: 'day',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        name: 'Maternity Leave',
        organisation_id: uuidv4(),
        code: 'ML',
        color: '#3357FF',
        type: 'paid',
        unit: 'day',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('leaves', null, {});
  }
};
