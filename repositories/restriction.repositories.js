const { restriction } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class restriction_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_leave_restriction ({restriction, transaction}) {
        let criteria = { leave_policy_id: restriction.leave_policy_id }
        return this.find_create_find(criteria, restriction, transaction)
    }
}

module.exports = {
    restriction_repository_obj: new restriction_repository({
        db_connection: sequelize,
        model: restriction,
    }),
};