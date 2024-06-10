const { session, attendance, justification } = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');
const { Op } = require("sequelize");

class session_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_sessions (sessions = [], transaction) {
        const options = { transaction };
        return this.bulk_create(sessions, options);
    }

    async get_session_by_uuid ({uuid, transaction}) {
        let criteria = {uuid: uuid};
        let attributes = ['id','group_id','type','week','hours','real_date'];
        let include = []
        return this.find_one(criteria,include,true,attributes,transaction)
    }

    async get_sessions_by_group_id ({group_id},{student_id_array}) {

        let criteria = {
            group_id: group_id
        };

        let include = [
            student_id_array.length > 0 ? {
                model: attendance,
                as: 'attendances',
                include: [
                    {
                        model: justification,
                        as: 'justification',
                        attributes: {
                            exclude: ['id', 'attendance_id']
                        }
                    }
                ],
                attributes: { 
                    exclude: ['id','session_id','student_id','previous_status'],
                    include: [
                        [
                            sequelize.literal(`(
                                SELECT uuid 
                                FROM students AS student
                                WHERE student.id = "attendances"."student_id"
                            )`),
                            'student_id'
                        ]
                    ]
                },
                where: {
                    '$attendances.student_id$': {
                        [Op.in]: student_id_array
                    }
                },
                required: false
            } : null,
        ].filter(Boolean);

        let attributes = {
            exclude:['id','group_id'],
            include: [
                [
                    sequelize.literal(`(
                            SELECT
                            json_build_object(
                                'absences', COALESCE(SUM(CASE WHEN a.status = 'absent' AND a.session_id = session.id THEN 1 ELSE 0 END), 0)::numeric,
                                'lateness', COALESCE(SUM(CASE WHEN a.status = 'late' AND a.session_id = session.id THEN 1 ELSE 0 END), 0)::numeric,
                                'attendance', COALESCE(SUM(CASE WHEN a.status = 'presented' AND a.session_id = session.id THEN 1 ELSE 0 END), 0)::numeric
                            ) AS genral_information
                    FROM attendances AS a
                    JOIN sessions AS s ON a.session_id = s.id
                    WHERE s.id = a.session_id 
                    )`),
                    'general_information',
                ],
                [
                    sequelize.literal('ARRAY[]::jsonb[]'),
                    'attendances',
                ],
            ]
        };

        let order = [
            ['week', 'ASC'],
            ['id', 'ASC']
        ];

        if (student_id_array.length > 0) {
            attributes.include.pop();
            order.push([sequelize.literal(`ARRAY_POSITION(ARRAY[${student_id_array}], "attendances"."student_id")`), 'ASC']);
        }

        return this.find_all(criteria, include, true, attributes, order);
    }

    async update_session ({uuid, type, hours, session_date, transaction}) {

        let criteria = { uuid: uuid }

        let payload = {
            type: type,
            hours: hours,
            real_date: session_date
        }
        
        const fields = [
            'uuid',
            'real_date',
            'type',
            'hours',
            'week',
            'created_at',
            'updated_at'
        ];

        return this.update(criteria, payload, fields, transaction);
    }
}

module.exports = {
    session_repository_obj: new session_repository({
      db_connection: sequelize,
      model: session,
    }),
};