const { applicability } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class applicability_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_leave_applicabilities ({applicabilities, transaction}) {
        // const options = { 
        //     ignoreDuplicates: true,
        //     transaction 
        // };
        // return this.bulk_create(applicabilities, options);

        const values = applicabilities.map(app => 
            `('${app.criteria}', ${app.value ? `'${app.value}'` : 'NULL'}, ${app.user_id ? `'${app.user_id}'` : 'NULL'}, NOW(), NOW())`
        ).join(', ');
        
        const query = `
        INSERT INTO applicabilities (criteria, value, user_id, created_at, updated_at)
        VALUES ${values}
        ON CONFLICT (criteria, value, user_id) DO NOTHING
        RETURNING id, criteria, value, user_id, created_at, updated_at;
        `;
        
        try {
            const [results, metadata] = await sequelize.query(query);
            return results;
        } catch (error) {
            console.error('Error creating applicabilities:', error);
            throw error;
        }
    }
}

module.exports = {
    applicability_repository_obj: new applicability_repository({
        db_connection: sequelize,
        model: applicability,
    }),
};