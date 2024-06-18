const { 
    leave,
    leave_policy: leave_policy_model,
    applicability: applicability_model,
    restriction: restriction_model,
    exception: exception_model
} = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class leave_repository extends base_repository {

    constructor(payload) {
        super(payload);
    }

    async create_leave({ leave, transaction }) {
        let criteria = { organisation_id: leave.organisation_id, name: leave.name };
        return this.find_create_find({ criteria, payload: leave, transaction })
    }

    async get_leaves_by_uuid({ clubbed_leaves, transaction }) {

        let criteria = {
            uuid: clubbed_leaves
        };

        let attributes = ['id']

        return this.find_all({ criteria, attributes, transaction });
    }

    async get_leave_policy({ leave_uuid, transaction }) {

        let criteria = {
            uuid: uuid
        };

        let attributes = ['id']

        return this.find_all({ criteria, attributes, transaction });
    }

    async get_leave_data_by_leave_uuid({ uuid, transaction }) {
        let criteria = {
            uuid: uuid
        }

        let include = [
            {
                model: leave_policy_model,
                as: 'leave_policy',
                attributes: {
                    exclude: ['id']
                },
                include: [
                    {
                        model: applicability_model,
                        as: 'applicabilities',
                        attributes: {
                            exclude: ['id', 'policy_applicability']
                        }
                    },
                    {
                        model: restriction_model,
                        as: 'restriction',
                        attributes: {
                            exclude: ['id']
                        }
                    },
                    {
                        model: exception_model,
                        as: 'exceptions'
                    }
                ]
            }
        ];

        let attributes = []

        return await this.find_one({ criteria, include, attributes, transaction });
    }


    async get_leaves_by_organisation_id({ payload, transaction }) {
        const { organisation_id, limit, offset, search_value, sort_column, sort_order, sort_key } = payload
        let criteria = {
            organisation_id: organisation_id
        }
        let include = [];
        let attributes = {};
        let order = [
            ['id', 'DESC']
        ];
        return this.find_all({ criteria, include, attributes, order, limit, transaction });
    }
}

module.exports = {
    leave_repository_obj: new leave_repository({
        db_connection: sequelize,
        model: leave,
    }),
};