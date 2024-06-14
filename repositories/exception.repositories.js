const { exception } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class exception_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_leave_exceptions ({exceptions, transaction}) {
        const options = { 
            updateOnDuplicate : ['criteria', 'value'],
            transaction 
        };

        console.log(exceptions)
        return this.bulk_create(exceptions, options);
    }
}

module.exports = {
    exception_repository_obj: new exception_repository({
        db_connection: sequelize,
        model: exception,
    }),
};