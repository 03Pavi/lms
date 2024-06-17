'use strict';
const {DataTypes} = require('sequelize');
const { leave_type_enum, leave_unit_enum } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leaves', {
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
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      organisation_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      code: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      color: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      type:{
        type: Sequelize.ENUM(leave_type_enum.get_available_leave_types()),
        defaultValue: leave_type_enum.leave_type.PAID,
        allowNull: false,
      },
      unit:{
        type: Sequelize.ENUM(leave_unit_enum.get_available_leave_units()),
        defaultValue: leave_unit_enum.leave_unit.DAY,
        allowNull: false,
      },
      is_active:{
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable('leaves');
  }
};