'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('teachers', 'full_name', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE teachers
      SET full_name = CONCAT(firstname, ' ', lastname)
      WHERE firstname IS NOT NULL AND lastname IS NOT NULL;
    `);

    await queryInterface.changeColumn('teachers', 'full_name', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.removeColumn('teachers', 'firstname');
    await queryInterface.removeColumn('teachers', 'lastname');

    await queryInterface.changeColumn('teachers', 'email',{
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('teachers', 'firstname', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('teachers', 'lastname', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE teachers
      SET firstname = SUBSTRING(full_name FROM 1 FOR POSITION(' ' IN full_name) - 1),
          lastname = SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1)
      WHERE full_name IS NOT NULL;
    `);

    await queryInterface.changeColumn('teachers', 'firstname',{
      type: Sequelize.STRING(50),
      allowNull: false,
    });

    await queryInterface.changeColumn('teachers', 'lastname',{
      type: Sequelize.STRING(50),
      allowNull: false,
    });

    await queryInterface.changeColumn('teachers', 'email',{
      type: Sequelize.STRING(50),
      allowNull: false,
    });

    await queryInterface.removeColumn('teachers', 'full_name');
  }
};
