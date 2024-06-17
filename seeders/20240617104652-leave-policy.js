'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('leave_policies', [
      {
        uuid: uuidv4(),
        leave_id: 1, 
        credit: 10,
        credit_period: 'monthly',
        reset: true,
        reset_period: 'yearly',
        carry_leaves: 5,
        encash_leaves: 2,
        description: 'Annual Leave Policy',
        valid_from: new Date(),
        valid_to: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        leave_id: 1,
        credit: 15,
        credit_period: 'yearly',
        reset: true,
        reset_period: 'yearly',
        carry_leaves: 3,
        encash_leaves: 1,
        description: 'Sick Leave Policy',
        valid_from: new Date(),
        valid_to: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        leave_id: 2, 
        credit: 20,
        credit_period: 'yearly',
        reset: true,
        reset_period: 'yearly',
        carry_leaves: 0,
        encash_leaves: 0,
        description: 'Maternity Leave Policy',
        valid_from: new Date(),
        valid_to: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('leave_policies', null, {});
  }
};
