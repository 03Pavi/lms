const max_messages = Number(process.argv.slice(2)[0]) || 10;
const { outbox_message_relay_obj } = require('./outbox_message_relay.service');
const { check_db_connection } = require('../config/db_connection')
const { connect_rabbit_mq } = require('../config/rabbit_mq_connection')

const outbox_message_relay_executor = async () => {
    try {
        await init_connections()
        await outbox_message_relay_obj.execute(max_messages);
        process.exit(0);
    } catch (error) {
        console.error('Error while executing outbox message relay:', error);
        process.exit(1);
    }
}

const init_connections = async () => {
        const is_rabbit_mq_connected = await connect_rabbit_mq()
        if (!is_rabbit_mq_connected) throw Object.assign(new Error(), { name: "RabbitMQ_CONNECTION_FAILED", message: "Failed to connect to rabbitmq" });
        const is_db_connected = await check_db_connection()
        if (!is_db_connected) throw Object.assign(new Error(), { name: "DB_CONNECTION_FAILED", message: "Failed to connect to database" })
}

outbox_message_relay_executor();