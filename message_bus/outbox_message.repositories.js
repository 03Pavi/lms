const { outbox_message: outbox_message_model } = require('../models');
const { sequelize } = require("../config/db_connection");
const { base_repository } = require('../repositories/base.repositories');
class outbox_message_repository extends base_repository {

    constructor(payload) {
        super(payload);
    }

    async store_outbox_messages(outbox_messages, transaction) {
        const options = {
            updateOnDuplicate: ["message_id"],
            transaction
        };
        return this.bulk_create(outbox_messages, options)
    }

    async get_unsent_messages(limit) {
        let criteria = {
            status: this.model.publish_status.PENDING_STATUS
        }
        let include = [];
        let attributes = {};
        let order = [
            ['id', 'ASC']
        ];
        return this.find_all(criteria, include, true, attributes, order, limit);
    }

    async mark_as_sent({ message_id }) {
        let criteria = {
            message_id: message_id,
        };

        let payload = {
            status: this.model.publish_status.SENT_STATUS,
            sent_at: new Date()
        }
        return this.update(criteria, payload);
    }

}
module.exports = {
    outbox_message_repository_obj: new outbox_message_repository({
        db_connection: sequelize,
        model: outbox_message_model,
    }),
};