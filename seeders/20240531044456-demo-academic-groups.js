'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    // Fetching academic element corresponding to academic_element_uuid
    const academic_element_uuid = "095be615-a8ad-4c33-8e9c-c7612fbf6c12";

    const academic_element = await queryInterface.sequelize.query(
      `SELECT id FROM academic_elements WHERE uuid = :uuid`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { uuid: academic_element_uuid }
      }
    );

    const academic_element_id = academic_element[0].id;


    // Fetching academic period corresponding to academic_period_uuid
    const academic_period_uuid = "9bd37cc2-01e7-40d4-a1a8-6b7c98907d3c";

    const academic_period = await queryInterface.sequelize.query(
      `SELECT id FROM academic_periods WHERE uuid = :uuid`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { uuid: academic_period_uuid }
      }
    );

    const academic_period_id = academic_period[0].id;

    // Inserting academic group
    await queryInterface.bulkInsert('groups', [
      {
          uuid: "b0fa801e-f0c8-4406-9785-4630224cde7a",
          name: "Group A",
          settings: JSON.stringify({
            "sessions_amount": 10,
            "sessions_per_week": 2,
            "hours_per_session": 2,
            "max_absence_percentage": {
                "theoretical_practical": 65,
                "practical": 65
            }
          }),
          academic_element_id: academic_element_id,
          academic_period_id: academic_period_id,
          created_at: new Date(),
          updated_at: new Date()
      }
    ], {});


    // Fetching academic group corresponding to group_uuid
    const group_uuid = "b0fa801e-f0c8-4406-9785-4630224cde7a";

    const group = await queryInterface.sequelize.query(
      `SELECT id FROM groups WHERE uuid = :uuid`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { uuid: group_uuid }
      }
    );

    const group_id = group[0].id;


    // Fetching all teachers corresponding to teacher_uuids array
    const teacher_uuids = [
      "3d7b74e6-c88c-4385-a65e-5739620ec343",
      "dc92a2e7-b607-495a-b950-2b986bf79358",
      "53f02d42-dae9-4c52-afdf-727b060754a9",
      "f4ce62bb-6305-47f4-849c-a3e85457b621",
      "0adabfc3-5006-44e9-ae4f-e4dbbab8965b",
      "4040a9e5-2f96-43ca-9b45-68dd52c9ebbc"
    ];

    const teachers = await queryInterface.sequelize.query(
      `SELECT id FROM teachers WHERE uuid IN (:uuids)`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { uuids: teacher_uuids }
      }
    );

    // Processing data from teacher and group association
    const group_teachers = teachers.map(teacher => {
      return {
        teacher_id: teacher.id,
        group_id,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Association of group and teachers
    await queryInterface.bulkInsert('group_teachers', group_teachers, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('group_teachers', null, {});
    await queryInterface.bulkDelete('groups', null, {});
  }
};
