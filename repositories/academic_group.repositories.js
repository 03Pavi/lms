const { group, session } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class academic_group_repository extends base_repository {

    constructor(payload) {
        super(payload);
    }

    async create_academic_group(academic_group, transaction) {
        let criteria = { uuid: academic_group.uuid };
        return this.find_create_find(criteria, academic_group, transaction);
    }

    async get_academic_group({ uuid }) {
        let criteria = { uuid: uuid };
        let include = [
            { model: session, as: 'sessions', attributes: ['id'] }
        ];
        const attributes = {};
        return this.find_one(criteria, include, true, attributes);
    }

    async get_academic_group_by_id({ id, transaction }) {
        let criteria = { id };
        let include = [];
        const attributes = ['uuid','name'];
        return this.find_one(criteria, include, true, attributes, transaction);
    }
}

module.exports = {
    academic_group_repository_obj: new academic_group_repository({
        db_connection: sequelize,
        model: group,
    }),
};