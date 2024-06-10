'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('teachers', [
      {
        uuid: "3d7b74e6-c88c-4385-a65e-5739620ec343",
        full_name: "kevin Aguirre",
        email: "kevin.aguirre@funiber.org",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: "dc92a2e7-b607-495a-b950-2b986bf79358",
        full_name: "Satyam Chawla",
        email: "satyam.1130@zenmonk.tech",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: "53f02d42-dae9-4c52-afdf-727b060754a9",
        full_name: "Anmol Sethi",
        email: "anmol.1157@zenmonk.tech",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: "f4ce62bb-6305-47f4-849c-a3e85457b621",
        full_name: "Lucia Terán",
        email: "lucia.teran@funiber.org",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: "0adabfc3-5006-44e9-ae4f-e4dbbab8965b",
        full_name: "Erika Ordoñez",
        email: "erika.ordonez@funiber.org",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: "4040a9e5-2f96-43ca-9b45-68dd52c9ebbc",
        full_name: "Telmo Riofrio",
        email: "telmo.riofrio@funiber.org",
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teachers', null, {});
  }
};
