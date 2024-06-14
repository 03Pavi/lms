'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applicabilities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      criteria: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      value: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        field: 'created_at',
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        field: 'updated_at',
        type: Sequelize.DATE
      }
    });
    
    await queryInterface.addConstraint('applicabilities', {
      type: 'unique',
      name: 'unique_applicability',
      fields: ['criteria', 'value']
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('applicabilities', 'unique_applicability');
    await queryInterface.dropTable('applicabilities');
  }
};