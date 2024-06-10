'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const student_uuids = [
      "b8d1a9df-f9b5-4ebe-b095-e5a019fd7275",
      "e426d8a6-47aa-40e8-87a4-a7907fbc4099",
      "3c722aa3-04af-48de-9cc7-88134edc6004",
      "e18f6121-e467-4f5a-b694-608980019835",
      "c395a922-9be2-42f7-9350-d18745331ad6",
      "c29d494f-1ea8-4e20-9a4c-5f6fa4203f46",
      "b105b962-cc42-4902-811c-8f4b4464e3c8",
      "77ab43e6-3d93-4152-a2f5-b01881ee128d",
      "e0c50d31-a947-4617-9185-c8d4c173922d",
      "814afecc-1aa4-4a30-9f37-3b845f9d93fe",
      "036f328d-c735-4f0b-8e45-dd13d04426be",
      "f0aaeec9-de6d-4398-9172-754cc1927c77",
      "38af7b0a-7e2d-41c9-a86a-57a5a2835596",
      "ac8c69c8-4302-4fe4-8937-9a42cdd418f9",
      "b1c2f983-1c3f-439e-80c5-7597ff813107",
    ];

    // Fetching the inserted students by their UUIDs
    const inserted_students = await queryInterface.sequelize.query(
      `SELECT id FROM students WHERE uuid IN (:uuids)`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { uuids: student_uuids }
      }
    );

    // Fetching academic group corresponding to group_uuid
    const group_uuid = "b0fa801e-f0c8-4406-9785-4630224cde7a";

    const group = await queryInterface.sequelize.query(
      `SELECT id FROM groups WHERE uuid = :uuid`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { uuid: group_uuid }
      }
    );


    // Fetching sessions corresponding to group_id
    const group_id = group[0].id;

    const sessions = await queryInterface.sequelize.query(
      `SELECT id FROM sessions WHERE group_id = :group_id`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { group_id }
      }
    );

    const genrate_attendances = (students, sessions) => {
      const attendances = [];
    
      for (const student of students) {
        for (const session of sessions) {
          const attendanceRecord = {
            student_id: student.id,
            session_id: session.id,
            status: null,
            created_at: new Date(),
            updated_at: new Date()
          };
    
          attendances.push(attendanceRecord);
        }
      }
    
      return attendances;
    }

    const attendances = genrate_attendances(inserted_students, sessions);

    // Inserting attendances
    await queryInterface.bulkInsert('attendances', attendances, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('justifications', null, {});
    await queryInterface.bulkDelete('attendances', null, {});
  }
};
