'use strict';
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
        type: Sequelize.STRING,
        allowNull: false,
      },
      orgainisation_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      leave_policy_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      type:{
        type: Sequelize.ENUM(leave_type_enum.get_available_leave_types()),
        defaultValue: leave_type_enum.leave_type.PAID,
        allowNull: true,
      },
      unit:{
        type: Sequelize.ENUM(leave_unit_enum.get_available_leave_units()),
        defaultValue: leave_unit_enum.leave_unit.DAY,
        allowNull: true,
      },
      is_active:{
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('leaves');
  }
};