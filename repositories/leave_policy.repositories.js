const { leave_policy: leave_policy_model } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class leave_policy_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_leave_policy ({leave_policy, transaction}) {
        let criteria = { leave_id: leave_policy.leave_id }
        return this.find_create_find(criteria, leave_policy, transaction)
    }
}

module.exports = {
    leave_policy_repository_obj: new leave_policy_repository({
        db_connection: sequelize,
        model: leave_policy_model,
    }),
};