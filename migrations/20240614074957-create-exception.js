'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exceptions', {
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

    await queryInterface.addConstraint('exceptions', {
      type: 'unique',
      name: 'unique_exception',
      fields: ['criteria', 'value']
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('exceptions', 'unique_exception');
    await queryInterface.dropTable('exceptions');
  }
};