'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    // Fetching session settings of academic group corresponding to group_uuid
    const group_uuid = "b0fa801e-f0c8-4406-9785-4630224cde7a";

    const group = await queryInterface.sequelize.query(
      `SELECT settings,id FROM groups WHERE uuid = :uuid`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { uuid: group_uuid }
      }
    );
    
    const { settings, id: group_id } = group[0];

    const genrate_sessions = (settings) => {
      let { sessions_amount, sessions_per_week, hours_per_session, group_id } = settings;
    
      if (!sessions_amount || !sessions_per_week || !group_id) {
        return [];
      }
    
      const sessions = [];
      sessions_per_week = parseInt(sessions_per_week);
      sessions_amount = parseInt(sessions_amount);
      hours_per_session = parseInt(hours_per_session);
    
      for (let i = 0; i < sessions_amount; i++) {
        const week = Math.floor(i / sessions_per_week) + 1;
        const hours = hours_per_session;
        sessions.push({
          uuid: uuidv4(),
          group_id,
          week,
          hours,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    
      return sessions;
    }

    const sessions = genrate_sessions( {...settings, group_id} );

    await queryInterface.bulkInsert('sessions', sessions, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sessions', null, {});
  }
};
