'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('academic_elements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID(36),
        unique: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('subject_version'),
        allowNull: false,
      },
      abbr: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      version: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      name: {
        type: Sequelize.JSON,
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
    // Drop academic_elements table
    await queryInterface.dropTable('academic_elements');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_academic_elements_type"');
  }
};