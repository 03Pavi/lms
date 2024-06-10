'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create academic_groups table
    await queryInterface.createTable('groups', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      session_settings: {
        allowNull: false,
        type: Sequelize.JSON
      },
      academic_element_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'academic_elements',
          key: 'id',
        },
      },
      academic_period_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'academic_periods',
          key: 'id',
        },
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

    // Add an index for the foreign key
    await queryInterface.addIndex('groups', ['academic_element_id']);
  },
  async down(queryInterface, Sequelize) {
    // Remove academic_groups table
    await queryInterface.dropTable('groups');
  }
};
