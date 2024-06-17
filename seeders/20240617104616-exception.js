'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('exceptions', [
      {
        criteria: 'genders',
        value: 'male',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        criteria: 'genders',
        value: 'female',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        criteria: 'genders',
        value: 'other',
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('exceptions', null, {});
  }
};
