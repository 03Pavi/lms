'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class leave_timeline extends Model {
        static leave_timeline_association;
        static associate(models) {
            this.leave_timeline_association = leave_timeline.belongsTo(models.leave_request, {
                foreignKey: "leave_request_id",
                as: "leave_request_timeline",
            });
        }
    }
    leave_timeline.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'UUID cannot be empty.',
                },
            },
        },
        leave_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'leaves',
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'Invalid start date value.'
                }
            }
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'Invalid start date value.'
                }
            }
        },
    }, {
        sequelize,
        modelName: 'leave_timeline',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return { leave_timeline };
};