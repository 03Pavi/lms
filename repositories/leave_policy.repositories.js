const { leave_policy: leave_policy_model } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class leave_policy_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_leave_policy({ leave_policy, transaction }) {
        let criteria = { leave_id: leave_policy.leave_id }
        return this.find_create_find({ criteria, payload: leave_policy, transaction })
    }
    async get_leave_policy_by_leave_id({ uuid, transaction }) {
        let criteria = { leave_id: uuid };
        let attributes = {
            exclude: ["id", "created_at", "updated_at", "leave_id"]
        }
        let include = []
        return this.find_one(criteria, include, true, attributes, transaction)
    }
    async get_leave_policy({ payload, transaction }) { }

}

module.exports = {
    leave_policy_repository_obj: new leave_policy_repository({
        db_connection: sequelize,
        model: leave_policy_model,
    }),
};