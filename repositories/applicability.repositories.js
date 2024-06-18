const { applicability } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class applicability_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_leave_applicabilities({ applicabilities, transaction }) {
        const options = {
            updateOnDuplicate: ['criteria', 'value'],
            transaction
        };
        return this.bulk_create(applicabilities, options);
    }
    async get_leave_applicability_by_leave_policy_id({ payload, transaction }) {
        const { uuid } = payload
        let criteria = { leave_policy_id: uuid };
        let attributes = {
            exclude: ["id", "created_at", "updated_at", "leave_id"]
        }
        let include = []
        return this.find_one(criteria, include, true, attributes, transaction)
    }
}

module.exports = {
    applicability_repository_obj: new applicability_repository({
        db_connection: sequelize,
        model: applicability,
    }),
};