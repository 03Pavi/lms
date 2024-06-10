const { producer_obj } = require('../workers/producer');
const { outbox_message_repository_obj } = require('./outbox_message.repositories');

class outbox_message_relay {

    constructor({ outbox_message_repository, rabbitmq_producer }) {
        this.outbox_message_repository = outbox_message_repository;
        this.rabbitmq_producer = rabbitmq_producer;
    }

    async execute(max_messages) {
        try {
            const messages = await this.outbox_message_repository.get_unsent_messages(max_messages);
            console.info(`Total unsent messages - ${messages.length}`)

            for (let index = 0; index < messages.length; index++) {

                const message = messages[index];
                const {message_id, type} = message;

                try {
                    const message_body = message.get_body();
                    const properties = message.get_properties();

                    console.info(`Publishing message ${index + 1} of ${messages.length} with MESSAGE_ID- ${message_id} of TYPE- ${type}`);
                    await this.rabbitmq_producer.publish_message(process.env.RABBIT_ROUTING_KEY, type, message_body, properties);
                    
                    await this.outbox_message_repository.mark_as_sent({ message_id });
                    console.info(`Published message ${index + 1} of ${messages.length} with MESSAGE_ID- ${message_id} of TYPE- ${type}`);
                } catch(error) {
                    console.log(`Error while publishing message ${index + 1} of ${messages.length} with MESSAGE_ID- ${message_id} of TYPE- ${type}`);
                }

            }
        }
        catch (error) {
            console.log("Error while publishing message", error)
            throw error;
        }
    }

}

module.exports = {
    outbox_message_relay_obj: new outbox_message_relay({
        outbox_message_repository: outbox_message_repository_obj,
        rabbitmq_producer: producer_obj,
    })
};