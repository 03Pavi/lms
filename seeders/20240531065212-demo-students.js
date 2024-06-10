'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const mock_students = [
      {uuid:"b8d1a9df-f9b5-4ebe-b095-e5a019fd7275", first_name:"Dominique", last_name:"Charle", dni:"796303137", created_at: new Date(), updated_at: new Date()},
      {uuid:"e426d8a6-47aa-40e8-87a4-a7907fbc4099", first_name:"Tobias", last_name:"McArt", dni:"247060562", created_at: new Date(), updated_at: new Date()},
      {uuid:"3c722aa3-04af-48de-9cc7-88134edc6004", first_name:"Shaylyn", last_name:"Tomasz", dni:"370862842", created_at: new Date(), updated_at: new Date()},
      {uuid:"e18f6121-e467-4f5a-b694-608980019835", first_name:"Yetty", last_name:"Balas", dni:"140363854", created_at: new Date(), updated_at: new Date()},
      {uuid:"c395a922-9be2-42f7-9350-d18745331ad6", first_name:"Sibelle", last_name:"Dyhouse", dni:"885315487", created_at: new Date(), updated_at: new Date()},
      {uuid:"c29d494f-1ea8-4e20-9a4c-5f6fa4203f46", first_name:"Evelin", last_name:"Bogace", dni:"793750440", created_at: new Date(), updated_at: new Date()},
      {uuid:"b105b962-cc42-4902-811c-8f4b4464e3c8", first_name:"Obadiah", last_name:"Luck", dni:"385535046", created_at: new Date(), updated_at: new Date()},
      {uuid:"77ab43e6-3d93-4152-a2f5-b01881ee128d", first_name:"Shani", last_name:"Rocca", dni:"167893590", created_at: new Date(), updated_at: new Date()},
      {uuid:"e0c50d31-a947-4617-9185-c8d4c173922d", first_name:"Lisette", last_name:"Wallhead", dni:"125330874", created_at: new Date(), updated_at: new Date()},
      {uuid:"814afecc-1aa4-4a30-9f37-3b845f9d93fe", first_name:"Milicent", last_name:"Dumphreys", dni:"698452812", created_at: new Date(), updated_at: new Date()},
      {uuid:"036f328d-c735-4f0b-8e45-dd13d04426be", first_name:"Lotte", last_name:"Hritzko", dni:"158626616", created_at: new Date(), updated_at: new Date()},
      {uuid:"f0aaeec9-de6d-4398-9172-754cc1927c77", first_name:"Nadine", last_name:"Petric", dni:"403241579", created_at: new Date(), updated_at: new Date()},
      {uuid:"38af7b0a-7e2d-41c9-a86a-57a5a2835596", first_name:"Rollins", last_name:"Ashfield", dni:"185908470", created_at: new Date(), updated_at: new Date()},
      {uuid:"ac8c69c8-4302-4fe4-8937-9a42cdd418f9", first_name:"Aloise", last_name:"Pavie", dni:"274402695", created_at: new Date(), updated_at: new Date()},
      {uuid:"b1c2f983-1c3f-439e-80c5-7597ff813107", first_name:"Emery", last_name:"Fursse", dni:"871982935", created_at: new Date(), updated_at: new Date()},
    ];

    // Inserting students
    await queryInterface.bulkInsert('students', mock_students, {});

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

    // Fetching the inserted students by their UUIDs
    const student_uuids = mock_students.map((student)=>student.uuid);

    const inserted_students = await queryInterface.sequelize.query(
      `SELECT id FROM students WHERE uuid IN (:uuids)`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { uuids: student_uuids }
      }
    );

    // Associating group with students
    const group_students = inserted_students.map((student)=>{
      return {
        student_id: student.id,
        group_id,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    await queryInterface.bulkInsert('group_students', group_students, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('group_students', null, {});
    await queryInterface.bulkDelete('students', null, {});
  }
};
