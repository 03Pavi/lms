const { 
    teacher_repository_obj,
    session_repository_obj,
    student_repository_obj,
    attendance_repository_obj,
    transaction_repository_obj,
    academic_group_repository_obj,
    academic_period_repository_obj,
    academic_element_repository_obj
} = require('../repositories');

const { genrate_sessions, genrate_attendances, transformed_students } = require('../lib/utils');

exports.create_academic_group = async (payload) => {

    let { impartation = [], academic_element = {}, academic_period = {}, ...academic_group } = payload;
    let { parent_academic_period = {}, ...academic_period_data } = academic_period;
    let { settings } = academic_group;

    academic_element.name = academic_element.name_i18n;
    delete academic_element['name_i18n'];

    const transaction = await transaction_repository_obj.start_transaction();

    try {

        let teachers = impartation.map((item) => {
            const { firstname = '', lastname = '', ...rest } = item.teacher;
            const teacher = { ...rest, full_name: `${firstname} ${lastname}` };
            return teacher;
        });

        let created_teachers = await teacher_repository_obj.create_teachers(teachers, transaction);
        
        let created_element = await academic_element_repository_obj.create_academic_element(academic_element, transaction);
        let academic_element_id = created_element.id;

        let created_parent_period = await academic_period_repository_obj.create_academic_period(parent_academic_period, transaction);
        let parent_period_id = created_parent_period.id;

        let created_academic_period = await academic_period_repository_obj.create_academic_period({
            ...academic_period_data,
            parent_period_id
        }, transaction);
        
        let academic_period_id = created_academic_period.id;

        let created_group = await academic_group_repository_obj.create_academic_group({ 
            ...academic_group,
            academic_element_id,
            academic_period_id 
        }, transaction);

        let group_id = created_group.id
        let sessions = genrate_sessions({...settings,group_id});
        
        sessions = await session_repository_obj.create_sessions(sessions, transaction);

        let students = await student_repository_obj.get_students_for_attendance({group_id, transaction});

        if(students && students.length !== 0) {
            let attendances = genrate_attendances(students,sessions);
            await attendance_repository_obj.create_attendances(attendances, transaction);
        }

        await created_group.addTeachers(created_teachers, { transaction });
        
        await transaction_repository_obj.commit_transaction(transaction);
        return created_group;

    } catch (error) {
        await transaction_repository_obj.rollback_transaction(transaction);
        throw error;
    }

};

exports.create_academic_group_students = async (payload) => {

    let { academic_group = {}, students = [] } = payload;
    let { uuid = '' } = academic_group;
    const transaction = await transaction_repository_obj.start_transaction();

    try {
        
        let group = await academic_group_repository_obj.get_academic_group({uuid});
        if(!group) {throw new Error("Academic group not found")}

        students = transformed_students(students);

        let created_students = await student_repository_obj.create_students(students, transaction);
        await group.addStudents(created_students, { transaction });

        let sessions = group.sessions;
        let attendances = genrate_attendances(created_students,sessions);

        await attendance_repository_obj.create_attendances(attendances, transaction);
        await transaction_repository_obj.commit_transaction(transaction);

        return { group:academic_group, students };

    } catch (error) {
        console.log(error)
        await transaction_repository_obj.rollback_transaction(transaction);
        throw error;
    }
}

exports.get_academic_groups = async (payload) => {
    let { teacher_uuid = '' } = payload.query;

    try {
        let academic_groups = await teacher_repository_obj.get_academic_groups_of_teacher({teacher_uuid});    
        let groups = academic_groups ? academic_groups.groups : [];
        return groups;
    } catch(error) {
        throw error;
    }
}
