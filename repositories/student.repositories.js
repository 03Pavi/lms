const { student, group, attendance, attendance_status_enum } = require('../models');
const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');
const { Op } = require("sequelize");

class student_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_students (students = [], transaction) {
        const options = { updateOnDuplicate:['uuid'] ,transaction };
        return this.bulk_create(students, options);
    }

    async get_students_for_attendance ({group_id, transaction}) {
        
        let criteria = {};
        let include = [
            {
                model: group,
                as: 'groups',
                through: { attributes: [] },
                where: { id: group_id },
                attributes: [],
            }
        ];
        let attributes = {};
        
        return this.find_all(criteria, include, true, attributes, undefined, undefined, transaction);
    }

    get_hours_calculation_queries ({column_name, session_type}) {
        if(column_name === 'practical_absence_hours' || column_name === 'theoretical_absence_hours') {
            return `COALESCE(SUM(CASE WHEN s.type = '${session_type}' AND s.group_id = :group_id AND a.status IN ('absent', 'late') THEN CASE WHEN a.status = 'late' THEN s.hours / 2.0 ELSE s.hours END ELSE 0 END), 0)`
        } else if(column_name === 'total_practical_hours' || column_name === 'total_theoretical_hours') {
            const attendance_statuses = attendance_status_enum.get_available_statuses();
            const status_list = attendance_statuses.map(status => `'${status}'`).join(', ');
            return `COALESCE(SUM(CASE WHEN s.type = '${session_type}' AND s.group_id = :group_id AND (a.status IN (${status_list}) OR a.status IS NULL) THEN s.hours ELSE 0 END), 0)`
        } else {
            throw Object.assign(new Error(), {name:"BAD_REQUEST", message:"Column name not valid"});
        }
    }

    async get_students_attendances_summary({students, group_id, transaction}) {

        let criteria = {
            id: students
        };

        let include = [];

        let attributes =  [
            "uuid",
            [sequelize.literal(`"first_name" || ' ' || "last_name"`), "name"],
            [
                sequelize.literal(`(
                    SELECT 
                        json_build_object(
                            'practical', (COALESCE(${this.get_hours_calculation_queries({ column_name: 'practical_absence_hours', session_type: 'practical' })}, 0) / GREATEST(1, COALESCE(${this.get_hours_calculation_queries({ column_name: 'total_practical_hours', session_type: 'practical' })}, 0))) * 100,
                            'theoretical_practical', (COALESCE(${this.get_hours_calculation_queries({ column_name: 'theoretical_absence_hours', session_type: 'theoretical_practical' })}, 0) / GREATEST(1, COALESCE(${this.get_hours_calculation_queries({ column_name: 'total_theoretical_hours', session_type: 'theoretical_practical' })}, 0))) * 100
                        ) 
                    FROM attendances AS a
                    JOIN sessions AS s ON a.session_id = s.id
                    WHERE a.student_id = student.id 
                )`),
                'absence_percentage'
            ]
        ]

        let order = [
            ['id', 'ASC'],
        ];

        let replacements = {
            group_id
        }

        return await this.find_all(criteria, include, true, attributes, order, undefined, transaction, replacements);
    }

    async get_students_by_group_id ({group_id},{limit,offset,search_value,sort_column,sort_order}) {

        let criteria = {};
        let include = [
            {
                model: group,
                as: 'groups',
                through: { attributes: [] },
                where: { id: group_id },
                attributes: [],
            }
        ];
        let sort_key = sort_column.sort_key;
        let attributes = {
            exclude:[],
            include: [
                [
                    sequelize.literal(`(
                        SELECT 
                            json_build_object(
                                'practical_absence_hours', ${this.get_hours_calculation_queries({column_name : 'practical_absence_hours', session_type : 'practical'})},
                                'theoretical_absence_hours', ${this.get_hours_calculation_queries({column_name : 'theoretical_absence_hours', session_type : 'theoretical_practical'})},
                                'total_practical_hours', ${this.get_hours_calculation_queries({column_name : 'total_practical_hours', session_type : 'practical'})},
                                'total_theoretical_hours', ${this.get_hours_calculation_queries({column_name : 'total_theoretical_hours', session_type : 'theoretical_practical'})}
                            ) 
                        FROM attendances AS a
                        JOIN sessions AS s ON a.session_id = s.id
                        WHERE a.student_id = student.id 
                    )`),
                    'session_hours'
                ],
                sort_key !== 'id' && sort_key !== 'dni' && sort_key !== 'last_name'  ? [
                    sequelize.fn('CAST', sequelize.literal(`(
                        SELECT 
                            ${this.get_hours_calculation_queries({column_name : sort_key, session_type : sort_column.session_type})}
                        FROM attendances AS a
                        JOIN sessions AS s ON a.session_id = s.id
                        WHERE a.student_id = student.id 
                    ) AS INTEGER`)),
                    sort_key
                ] : null,
            ].filter(Boolean)
        };

        if (search_value && search_value.trim() !== "") {
            criteria[Op.or] = [
                sequelize.where(sequelize.literal(`dni`), { [Op.iLike]: `%${search_value.trim()}%` }),
                sequelize.where(sequelize.literal(`CONCAT_WS(' ', "first_name", "last_name")`), { [Op.iLike]: `%${search_value.trim()}%` }),
                sequelize.where(sequelize.literal(`CONCAT_WS(' ', "last_name", "first_name")`), { [Op.iLike]: `%${search_value.trim()}%` })
            ];
        }
        
        let order = [
            [sequelize.literal(sort_key), sort_order],
        ];

        let replacements = {
            group_id
        }
        
        return this.find_and_count_all(criteria,include,offset,limit,true,attributes,order,replacements);
    }

    async get_student_by_uuid ({uuid, transaction}) {
        let criteria = {uuid: uuid};
        let attributes = ['id','dni'];
        let include = []
        return this.find_one(criteria,include,true,attributes,transaction)
    }

    async get_students_by_uuid ({student_id, session_id, transaction}) {
        let criteria = {
            uuid: {
                [Op.in]: student_id,
            },
        }
        let include = [];
        let attributes =  [
            'id',
            'uuid',
            session_id && [sequelize.literal(`(SELECT status FROM attendances WHERE student_id = student.id AND session_id = :session_id)`),'previous_status'],
        ].filter(Boolean);

        let replacements = {
            session_id
        };
        
        return this.find_all(criteria, include, true, attributes, undefined, undefined, transaction, replacements);
    }
    
    async get_filtered_students({group_id, session_id, status}) {
        let criteria = {}

        let include = [
            {
                model: group,
                as: 'groups',
                through: { attributes: [] },
                where: { id: group_id },
                attributes: [],
            },
            {
                model: attendance,
                as: 'attendances',
                attributes: [], 
                where : {
                    session_id: session_id,
                    ...(status && status.length > 0 && { status: status })
                }
            },
        ];

        const attributes = { 
            exclude:['id'],
            include:[
                [
                    sequelize.literal(`(
                        SELECT status 
                        FROM attendances AS attendance
                        WHERE attendance.student_id = student.id AND attendance.session_id = :session_id
                    )`),
                    'attendance_status'
                ]
            ]
        };

        let order = [
            ['last_name', 'ASC'],
        ];

        let replacements = {
            session_id
        };

        return this.find_all(criteria,include,true,attributes,order,undefined,undefined,replacements);
    }
    
}

module.exports = {
    student_repository_obj: new student_repository({
      db_connection: sequelize,
      model: student,
    }),
};
