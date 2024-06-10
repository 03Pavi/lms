'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('presented', 'absent', 'late', 'dispense'),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        field: 'created_at',
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        field: 'updated_at',
        type: Sequelize.DATE,
      },
    });

    // Add unique constraint on the combination of session_id and student_id
    await queryInterface.addConstraint('attendances', {
      type: 'unique',
      name: 'session_student_unique',
      fields: ['session_id', 'student_id']
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('attendances', 'session_student_unique');
    await queryInterface.dropTable('attendances');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_attendances_status"');
  }
};