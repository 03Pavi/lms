const { attendance, justification, attendance_status_enum } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

const { Sequelize, Op } = require('sequelize');

class attendance_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    get_attendance_statuses_for_justification() {
        return this.model.get_attendance_statuses_for_justification();
    }

    get_justified_attendance_status() {
        return attendance_status_enum.attendance_statuses.JUSTIFIED;
    }

    async create_attendances (attendances = [], transaction) {
        const options = {
            updateOnDuplicate: ["status"],
            transaction
        };
        return this.bulk_create(attendances, options)
    }

    async get_attendance ({student_id, session_id, status = [], transaction}) {
        let criteria = {
            session_id: session_id,
            student_id: student_id,
            ...(status && status.length > 0 && { status: status })
        };

        let include = [
            {
                model: justification,
                as: 'justification',
            }
        ];

        let attributes = {
            exclude: ['student_id', 'session_id'],
            include: [
                [
                    sequelize.literal(`(
                        SELECT uuid 
                        FROM students AS student
                        WHERE student.id = "attendance"."student_id"
                    )`),
                    'student_id'
                ],
                [
                    sequelize.literal(`(
                        SELECT uuid 
                        FROM sessions AS session
                        WHERE session.id = "attendance"."session_id"
                    )`),
                    'session_id'
                ]
            ]
        };

        return this.find_one(criteria, include, true, attributes, transaction);
    }

    async get_students_attendance_by_session_id ({session_id, transaction}) {
        let criteria = {
            session_id: session_id,
            [Op.or]: [
                {
                    status: {
                        [Op.not]: this.get_justified_attendance_status(),
                    },
                },
                {
                    status: {
                        [Op.is]: null,
                    },
                },
            ],
        }
        let include = [];

        const attributes = [
            ['student_id', 'id'],
            [
                Sequelize.literal('(SELECT uuid FROM students WHERE id = attendance.student_id)'),
                'uuid'
            ],
            ['status', 'previous_status']
        ];

        return this.find_all(criteria, include, true, attributes, undefined, undefined, transaction);
    }

    async update_attendance ({session_id,student_id_array,payload,transaction}) {
        let criteria =  {
            student_id: student_id_array,
            session_id: session_id,
        };
        
        let fields = [
            'id',
            'student_id',
            'status',
            'created_at',
            'updated_at',
        ];
    
        return this.update(criteria, payload, fields, transaction);                
    }

}

module.exports = {
    attendance_repository_obj: new attendance_repository({
      db_connection: sequelize,
      model: attendance,
    }),
};
