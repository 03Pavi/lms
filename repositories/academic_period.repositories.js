const {
    academic_period,
} = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class academic_period_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_academic_period (academic_period, transaction) {
        let criteria = { uuid: academic_period.uuid }
        return this.find_create_find(criteria, academic_period, transaction)
    }
}

module.exports = {
    academic_period_repository_obj: new academic_period_repository({
        db_connection: sequelize,
        model: academic_period,
    }),
};