'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('policy_applicabilities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      applicability_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      leave_policy_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        fields: 'created_at',
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        fields: 'updated_at',
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('policy_applicabilities');
  }
};