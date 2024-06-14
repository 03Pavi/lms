'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clubbed_leaves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      restriction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      leave_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        field: "created_at",
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        field: "updated_at",
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clubbed_leaves');
  }
};