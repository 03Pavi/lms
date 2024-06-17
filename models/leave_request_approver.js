'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class leave_request_approver extends Model {
        static leave_request_approver_leave_request_association;
        static associate(models) {
            this.leave_request_approver_leave_request_association = leave_request_approver.belongsTo(models.leave_request, {
                foreignKey: "leave_request_id",
                as: "leave_request_approver",
            });
        }
    }
    leave_request_approver.init({
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
        leave_request_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'leaves',
                key: 'id'
            }
        },
        approval_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        stage: {
            type: DataTypes.STRING(100),
            allowNull: true,
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
        modelName: 'leave_request_approver',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return { leave_request_approver };
};