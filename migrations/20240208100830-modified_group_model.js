'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('groups', 'session_settings', 'settings');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('groups', 'settings', 'session_settings');
  }
};
