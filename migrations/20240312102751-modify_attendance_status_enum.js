"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_attendances_status"
      RENAME VALUE 'dispense' TO 'dispensed';
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_attendances_status"
      ADD VALUE 'justified' AFTER 'dispensed';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE "attendances"
      SET "status" = 'absent'
      WHERE "status" = 'justified';
    `);

    await queryInterface.changeColumn("attendances", "status", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_attendances_status"
      RENAME TO "enum_attendances_status_temp";
    `);

    await queryInterface.changeColumn("attendances", "status", {
      type: Sequelize.ENUM("presented", "absent", "late", "dispense"),
      allowNull: true,
    });

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_attendances_status_temp"');
  },
};
