const { leave: leave_model } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class leave_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_leave ({leave, transaction}) {
        let criteria = { organisation_id: leave.organisation_id }
        console.log(leave);
        return this.find_create_find(criteria, leave, transaction)
    }
}

module.exports = {
    leave_repository_obj: new leave_repository({
        db_connection: sequelize,
        model: leave_model,
    }),
};