'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('academic_elements', [
      {
        uuid: "095be615-a8ad-4c33-8e9c-c7612fbf6c12",
        type: "subject_version",
        abbr: "Elem",
        version: "V1",
        name: JSON.stringify({
            "en_US": "Element 1",
            "es_ES": "Elemento 1"
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('academic_elements', null, {});
  }
};
