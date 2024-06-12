const { connect_rabbit_mq } = require('../config/rabbit_mq_connection');
const { check_db_connection } = require('../config/db_connection');

const processors = {};

const consume_messages = async () => {
  try {
    await init_connections();
    const connection = await global.rabbit_mq_connection;
    const channel = await connection.createChannel();

    await channel.assertExchange(process.env.RABBIT_EXCHANGE, process.env.RABBIT_TYPE_EXCHANGE);
    const q = await channel.assertQueue(process.env.RABBIT_QUEUE, { durable: true });
    await channel.bindQueue(process.env.RABBIT_QUEUE, process.env.RABBIT_EXCHANGE, '');
    console.log(`Waiting for messages in ${process.env.RABBIT_QUEUE}`);
    channel.consume(q?.queue, async (msg) => {
      console.log('\n\n================= NEW MESSAGE CONSUMING ====================');
      console.log('msg: ', 'headers: ', msg?.properties?.headers, 'type: ', msg?.properties?.type, '\n');

      const handle_processor = processors[msg?.properties?.type] || processors[msg?.properties?.headers?.type];

      if (handle_processor) {
        try {
          const data = JSON.parse(msg?.content?.toString());
          console.log(data);
          await handle_processor(data);
          channel.ack(msg);
        } catch (error) {
          console.log(error.message);
          channel.nack(msg, false, false);
        }
      } else {
        console.log(`Messages ignore with id: ${msg?.properties?.messageId}`);
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    console.log('Error in consume messages: ', err);
  }
}

const init_connections = async () => {
  const is_rabbit_mq_connected = await connect_rabbit_mq();
  if (!is_rabbit_mq_connected) throw Object.assign(new Error(), { name: "RabbitMQ_CONNECTION_FAILED", message: "Failed to connect to rabbitmq" });
  const is_db_connected = await check_db_connection();
  if (!is_db_connected) throw Object.assign(new Error(), { name: "DB_CONNECTION_FAILED", message: "Failed to connect to database" });
}

consume_messages();

