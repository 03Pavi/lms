const { leave } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class leave_repository extends base_repository {

    constructor(payload) {
        super(payload);
    }

    async create_leave ({leave, transaction}) {
        let criteria = { organisation_id: leave.organisation_id };
        return this.find_create_find({criteria, payload:leave, transaction})
    }

    async get_leaves_by_uuid({clubbed_leaves, transaction}) {
        
        let criteria = {
            uuid: clubbed_leaves
        };

        let attributes = ['id']

        return this.find_all({criteria, attributes, transaction});
    }


    async get_leaves_by_organisation_id({organisation_id,limit,transaction}) {
        let criteria = {
            organisation_id: organisation_id
        }
        let include = [];
        let attributes = {};
        let order = [
            ['id', 'DESC']
        ];
        return this.find_all({criteria, include, attributes, order, limit, transaction});
    }

}

module.exports = {
    leave_repository_obj: new leave_repository({
        db_connection: sequelize,
        model: leave,
    }),
};