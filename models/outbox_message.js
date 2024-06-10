'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class outbox_message extends Model {

    static publish_status = {
      PENDING_STATUS: 'PENDING',
      SENT_STATUS: 'SENT'
    }

    static get_available_statuses() {
      const status_keys = Object.keys(outbox_message.publish_status)
      return status_keys.map(key => (outbox_message.publish_status[key]));
    }

    get_body() {
      return this.body;
    }

    get_properties() {
      return this.properties;
    }
  }

  outbox_message.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    message_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Message Id is required.",
        },
      },
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Type is required.",
        },
        notEmpty: {
          msg: "Type cannot be empty.",
        },
      },
    },
    headers: {
      type: DataTypes.JSON,
    },
    properties: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Properties is required.",
        }
      }
    },
    body: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Body is required.",
        }
      }
    },
    status: {
      type: DataTypes.ENUM(outbox_message.get_available_statuses()),
      allowNull: false,
      defaultValue: outbox_message.publish_status.PENDING_STATUS,
      validate: {
        isIn: {
          args: [outbox_message.get_available_statuses()],
          msg: 'Invalid status value.',
        },
      },
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Invalid sent_at value.'
        }
      }
    },
  }, {
    sequelize,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'outbox_message',
  });
  return { outbox_message };
};