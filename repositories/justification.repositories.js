const { justification, attendance } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class justification_repository extends base_repository {

    constructor(payload) {
        super(payload);
    }

    async upsert_justification ({justification,transaction}) {
        let payload = justification;
        return this.upsert(payload, transaction);
    }

    async delete_justification ({id, transaction}) {
        let criteria = {id: id};

        let include = [];

        return this.destroy(criteria, false, include, transaction);
    }
}

module.exports = {
    justification_repository_obj: new justification_repository({
        db_connection: sequelize,
        model: justification,
    }),
};