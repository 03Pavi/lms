'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class status_enum {
        static status_enums = {
            WEEK: 'week',
            MONTH: 'month',
            YEAR: 'year',
            ACCRUAL_PERIOD: 'accrual period',
            JOB_TENURE: 'job tenure',
        };

        static get_available_enums() {
            return Object.values(status_enum.status_enums);
        }
    }

    class leave_request extends Model {

        static leave_request_leave_association;
        static leave_request_leave_timeline_association;
        static leave_request_leave_request_approver_association;
        static associate(models) {
            this.leave_request_leave_association = leave_request.belongsTo(models.leave, {
                foreignKey: "leave_id",
                as: "leave_request",
            });
            this.leave_request_leave_timeline_association = leave_request.hasMany(models.leave_timeline, {
                foreignKey: "leave_request_id",
                as: "leave_request_timeline",
            });
            this.leave_request_leave_request_approver_association = leave_request.hasMany(models.leave_request_approver, {
                foreignKey: "leave_request_id",
                as: "leave_request_approver",
            });
        }
    }
    leave_request.init({
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
        status: {
            type: DataTypes.ENUM(status_enum.get_available_enums()),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Status cannot be empty.'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'leave_request',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return { leave_request };
};