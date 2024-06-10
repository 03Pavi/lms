'use strict';
const { outbox_message } = require("../models")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('outbox_messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      headers: {
        type: Sequelize.JSON,
      },
      properties: {
        type: Sequelize.JSON,
        allowNull: false
      },
      body: {
        type: Sequelize.JSON,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(outbox_message.get_available_statuses()),
        allowNull: false,
        defaultValue: outbox_message.publish_status.PENDING_STATUS
      },
      sent_at: {
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
    await queryInterface.dropTable('outbox_messages');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_outbox_messages_status"');
  }
};