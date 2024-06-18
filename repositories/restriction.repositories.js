const { restriction } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class restriction_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_leave_restriction({ restriction, transaction }) {
        let criteria = { leave_policy_id: restriction.leave_policy_id }
        return this.find_create_find({ criteria, payload: restriction, transaction })
    }

    async get_restriction_by_leave_policy_id({ payload, transaction }) {
        const { leave_policy_id } = payload
        let criteria = { leave_policy_id: leave_policy_id };
        let attributes = {
            exclude: ["id", "created_at", "updated_at"]
        }
        let include = []
        return this.find_one(criteria, include, true, attributes, transaction)
    }
}

module.exports = {
    restriction_repository_obj: new restriction_repository({
        db_connection: sequelize,
        model: restriction,
    }),
};