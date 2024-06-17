'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('policy_applicabilities', [
      {
        applicability_id: 1,
        leave_policy_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        applicability_id: 2,
        leave_policy_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        applicability_id: 3,
        leave_policy_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        applicability_id: 4,
        leave_policy_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('policy_applicabilities', null, {});
  }
};
