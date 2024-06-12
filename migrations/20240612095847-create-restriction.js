'use strict';
const {exceeded_limit_enum} = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('restrictions', {
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
      leave_policy_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'leave_policies',
          key: 'id'
        }
      },
      allow_exceed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      exceed_limit: {
        type: Sequelize.ENUM(exceeded_limit_enum.get_available_exceeded_limits()),
        defaultValue: exceeded_limit_enum.exceeded_limit.WITHOUT_LIMIT,
        allowNull: true,
      },
      excess_as_lop: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      sandwich_leave: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      sandwich_weekend: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sandwich_holiday: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('restrictions');
  }
};