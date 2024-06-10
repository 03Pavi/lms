'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('justifications', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      attendance_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'attendances',
          key: 'id',
        },
      },
      comment: {
        type: Sequelize.STRING(255),
      },
      file: {
        type: Sequelize.STRING(255),
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
      },
      deletedAt: {
        field: 'deleted_at',
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('justifications');
  }
};
