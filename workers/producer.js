const { v4: uuidv4 } = require('uuid');

class Producer {
  channel;

  async create_channel () {
    const connection = await global.rabbit_mq_connection;
    this.channel = await connection.createChannel();
  }

  async publish_message (routing_key, signature, body, properties) {
    if (!this.channel) {
      await this.create_channel();
    }

    await this.channel.assertExchange(process.env.RABBIT_EXCHANGE, process.env.RABBIT_TYPE_EXCHANGE);

    const publish_details = {
      uuid: uuidv4(),
      fired_at: new Date(),
      ...body
    };

    await this.channel.publish(
      process.env.RABBIT_EXCHANGE,
      routing_key,
      Buffer.from(JSON.stringify(publish_details)),
      properties
    );
    
    console.log(`This message ${signature} is sent to exchange ${process.env.RABBIT_EXCHANGE}`);
  }
}

module.exports = {
  producer_obj : new Producer()
};
