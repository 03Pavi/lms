const {
    teacher,
    group,
    academic_element,
    academic_period
} = require('../models');

const { sequelize } = require("../config/db_connection");
const { base_repository } = require('./base.repositories');

class teacher_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }

    async create_teachers (teachers = [], transaction) {
        const options = { updateOnDuplicate: ['uuid'], transaction };
        return this.bulk_create(teachers, options);
    }

    async get_teacher_detail({email_id}) {
        let criteria = { email: email_id };
        let include = [];
        const attributes = {
            exclude: ['id'],
        };        
        return this.find_one(criteria, include, true, attributes);
    }

    async get_academic_groups_of_teacher({ teacher_uuid }) {
        let criteria = {
            uuid: teacher_uuid
        };
        let include = [
            {
                model: group, as: 'groups',
                through: { attributes: [] },
                attributes: {
                    exclude: ['id','academic_element_id', 'academic_period_id','settings'],
                    include: [
                        [
                            sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM group_students AS group_student
                                WHERE group_student.group_id = groups.id
                            )`),
                            'no_of_students'
                        ]
                    ]
                },
                include: [
                    { 
                        model: academic_element, as: 'academic_element',
                        attributes: {exclude: ['id']},
                    },
                    {
                        model: academic_period, as: 'academic_period',
                        attributes: {exclude: ['id','parent_period_id']},
                        include: [
                            { 
                                model: academic_period, as: 'parent_academic_period',
                                attributes: {exclude: ['id','parent_period_id']}, 
                            }
                        ],
                    }
                ],
            }
        ];

        const attributes = []

        return this.find_one(criteria, include, true, attributes);
    }

}

module.exports = {
    teacher_repository_obj: new teacher_repository({
      db_connection: sequelize,
      model: teacher,
    }),
};