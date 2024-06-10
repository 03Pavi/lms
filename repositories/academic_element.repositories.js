const {
    academic_element: academic_element_model,
} = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class academic_element_repository extends base_repository {

    constructor(payload) {
        super(payload);
    }

    async create_academic_element(academic_element, transaction) {
        let criteria = { uuid: academic_element.uuid };
        return this.find_create_find(criteria, academic_element, transaction);
    }

    async get_element_by_uuid({uuid}) {
        let criteria = { uuid };
        let include = [];
        const attributes = ['abbr'];
        return this.find_one(criteria, include, true, attributes);
    }

}

module.exports = {
    academic_element_repository_obj: new academic_element_repository({
        db_connection: sequelize,
        model: academic_element_model,
    }),
};