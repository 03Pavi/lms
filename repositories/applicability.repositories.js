const { applicability } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class applicability_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_leave_applicabilities ({applicabilities, transaction}) {
        const options = { updateOnDuplicate: ['criteria','value','user_id'], transaction };
        return this.bulk_create(applicabilities, options);
    }
}

module.exports = {
    applicability_repository_obj: new applicability_repository({
        db_connection: sequelize,
        model: applicability,
    }),
};