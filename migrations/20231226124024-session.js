'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
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
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expected_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      real_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('theoretical_practical', 'practical'),
        allowNull: true,
      },
      hours: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      week: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        field: 'created_at',
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        field: 'updated_at',
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sessions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sessions_type"');
  }
};