'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sessions', 'expected_date');
    await queryInterface.changeColumn('sessions', 'type', {
      type: Sequelize.ENUM('theoretical_practical', 'practical'),
      defaultValue: 'theoretical_practical',
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('sessions', 'expected_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('sessions', 'type', {
      type: Sequelize.ENUM('theoretical_practical', 'practical'),
      allowNull: true,
    });
  }
};
