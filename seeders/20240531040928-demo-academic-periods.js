'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('academic_periods', [
      {
        uuid: "6843fe45-f7d0-4360-a10d-6feb2c5ab4d1",
        name: "2022-2023",
        start_date: "2022-05-05",
        end_date: "2023-05-05",
        type: "annual",
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    const parent_period_uuid = "6843fe45-f7d0-4360-a10d-6feb2c5ab4d1";

    const parent_period = await queryInterface.sequelize.query(
      `SELECT id FROM academic_periods WHERE uuid = :uuid`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { uuid: parent_period_uuid }
      }
    );

    const parent_period_id = parent_period[0].id;

    await queryInterface.bulkInsert('academic_periods', [
      {
        uuid: "9bd37cc2-01e7-40d4-a1a8-6b7c98907d3c",
        name: "Sem 2",
        start_date: "2023-05-01",
        end_date: "2023-05-05",
        type: "biannual",
        parent_period_id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('academic_periods', null, {});
  }
};
