'use strict';
const { leave_period_enum } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leave_policies', {
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
      leave_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "leaves",
          key: 'id'
        }
      },
      credit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      credit_period: {
        type: Sequelize.ENUM(leave_period_enum.get_available_periods()),
        allowNull: true,
      },
      reset: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      reset_period: {
        type: Sequelize.ENUM(leave_period_enum.get_available_periods()),
        allowNull: true,
      },
      carry_leaves: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      encash_leaves: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      valid_from: {
        type: Sequelize.DATE,
        allowNull: false
      },
      valid_to: {
        type: Sequelize.DATE,
        allowNull: true
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('leave_policies');
  }
};