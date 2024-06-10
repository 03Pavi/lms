const { 
    filtered_status,
    generate_pagination_info,
    update_attendance_with_uuid, 
    is_valid_url,
    extract_file_name_from_url
} = require("../lib/utils");

const { 
    session_repository_obj,
    student_repository_obj,
    attendance_repository_obj,
    transaction_repository_obj,
    justification_repository_obj,
    academic_group_repository_obj,
    outbox_message_repository_obj,
    academic_element_repository_obj,
} = require('../repositories');

const { generate_v4_upload_signed_url, get_read_signed_url, delete_file_from_bucket } = require("./cloud_storage.services");

const { v4: uuidv4 } = require('uuid');

exports.get_attendance_list = async (payload) => {
    
    let { academic_group_uuid = '', page = '1', limit = '10', search_value = '', sort_column = 'last_name', sort_order = 'asc' } = payload.query;

    try {
        let options = generate_pagination_info(page, limit, sort_column, sort_order);
        
        limit = options.limit;
        sort_order = options.sort_order;
        sort_column = options.sort_column;
        
        let sort_key = sort_column.sort_key;
        let offset = options.offset;

        let academic_group = await academic_group_repository_obj.get_academic_group({uuid:academic_group_uuid});
        if(!academic_group) {return}
        let group_id = academic_group.id;

        let student_list = await student_repository_obj.get_students_by_group_id({group_id},{limit,offset,search_value,sort_column,sort_order});

        let student_id_array = [];
        let students_without_id = student_list.rows.map((student) => {
            student = student.toJSON();
            let { id, ...rest } = student;
            if(sort_key !== 'id' && sort_key !== 'dni' && sort_key !== 'last_name') {
                delete rest[sort_key];
            }
            student_id_array.push(id);
            return rest;
        });

        let session_list = await session_repository_obj.get_sessions_by_group_id({group_id},{student_id_array});
    
        return {
            students: students_without_id,
            no_of_students: student_list.count,
            sessions: session_list,
            settings: academic_group.settings
        };
    } catch (error) {
        throw error
    }

}

exports.get_student_list = async (payload) => {
    let { uuid = '' } = payload.params;
    let { status = [] } = payload.query;

    try {
        let available_attendance_status = attendance_repository_obj.get_attendance_statuses_for_justification();
        status = filtered_status(status, available_attendance_status);
        let session = await session_repository_obj.get_session_by_uuid({uuid});

        if(!session) { 
            throw Object.assign(new Error(), {name:"NOT_FOUND", message:"Session Not Found"});
        }

        let session_id = session.id;
        let group_id = session.group_id;
        
        let students = await student_repository_obj.get_filtered_students({group_id, session_id, status});

        if(students.length === 0) {
            return;
        }

        return students;
    } catch (error) {
        throw error;
    }
}

const store_attendance_marked_event_messages = async (payload) => {

    let { students = [], session = {}, status, transaction } = payload;

    try {
        const attendances_summary = await student_repository_obj.get_students_attendances_summary({students, group_id: session.group_id, transaction});

        let group = (await academic_group_repository_obj.get_academic_group_by_id({ id: session.group_id, transaction }));

        if(!group) {
            throw Object.assign(new Error(), {name:"NOT_FOUND", message:"Group Not Found"});
        }

        group = group.toJSON();

        const signature = process.env.RABBIT_ATTENDANCE_MARKED_SIGNATURE;

        const events = attendances_summary.map(element => {

            const student = element.toJSON();
            const message_id = uuidv4();
            return {
                message_id : message_id ,
                type: signature,
                properties: {
                    messageId:message_id,
                    type: signature,
                    persistent: true,
                    appId: process.env.RABBIT_QUEUE,
                    contentType: "application/json",
                    headers: {
                        type: signature,
                        content_type: "application/json",
                      }
                },
                body: {
                    attendance: {
                        status,
                        session: {
                            date: session.real_date,
                            type: session.type
                        }
                    },
                    student: {
                        uuid: student.uuid,
                        name: student.name
                    },
                    academic_group: {
                        uuid: group.uuid,
                        name: group.name
                    },
                    attendances_summary: {
                        absence_percentage: student.absence_percentage
                    }
                }
            };
        });
        
        await outbox_message_repository_obj.store_outbox_messages(events,transaction);

    } catch (error) {
        throw error;
    }
}

exports.create_attendances = async (payload) => {

    let {uuid = ''} = payload.params;
    let {student_id = [], status = ''} = payload.body;

    const transaction = await transaction_repository_obj.start_transaction();

    try {

        if(status === attendance_repository_obj.get_justified_attendance_status()) {
            throw Object.assign(new Error(), {name:"CONFLICT", message:"Attendances Not Created"});
        }

        let session = await session_repository_obj.get_session_by_uuid({uuid, transaction});

        if(!session) { 
            throw Object.assign(new Error(), {name:"NOT_FOUND", message:"Session Not Found"});
        }

        let session_id = session.id;
        let group_id = session.group_id
        let session_real_date = session.real_date;

        if(!session_real_date) {
            let { updated_rows: [updated_session] } = await session_repository_obj.update_session(
                {
                    uuid: uuid,
                    type: session.type,
                    hours: session.hours,
                    session_date: new Date(),
                    transaction
                }
            );

            updated_session = updated_session.toJSON()
            session = {...updated_session, id: session_id, group_id};
        }

        let students = [];
    
        if(!student_id  || student_id.length === 0) {
            students = await attendance_repository_obj.get_students_attendance_by_session_id({session_id, transaction});
        } else {
            students = await student_repository_obj.get_students_by_uuid({student_id, session_id, transaction});
        }

        if(students.length === 0) {
            throw Object.assign(new Error(), {name:"CONFLICT", message:"Attendances Not Created"});
        }
    
        let student_id_array = [];
        let attendances = students.map((student)=>{
            student = student.toJSON();
            student_id_array.push(student.id);
            return {
                student_id: student.id,
                session_id: session_id,
                status: status,
                previous_status: student.previous_status,
            };
        });

        let marked_attendances = await attendance_repository_obj.create_attendances(attendances, transaction);
        
        if(!marked_attendances || marked_attendances.length === 0) {
            throw Object.assign(new Error(), {name:"CONFLICT", message:"Attendances Not Created"});
        }

        const updated_attendances = update_attendance_with_uuid(marked_attendances, students);
        await store_attendance_marked_event_messages({students:student_id_array, session, status, transaction});

        await transaction_repository_obj.commit_transaction(transaction);
        return {session_id: uuid, attendances: updated_attendances};
    } catch(error) {
        await transaction_repository_obj.rollback_transaction(transaction);
        throw error;
    }
}

exports.update_session = async (payload) => {
    let {uuid = ''} = payload.params;
    let {type , hours , session_date } = payload.body

    try {
        const { updated_row_count, updated_rows } = await session_repository_obj.update_session({uuid, type, hours, session_date});
        if(!updated_rows || updated_row_count === 0) {
            throw Object.assign(new Error(), {name:"NOT_FOUND", message:"Session Not Found"});
        }
        const updated_session = updated_rows[0];
        return updated_session;
    } catch(error) {
        throw error;
    }
}

exports.create_justification = async (payload) => {

    let {uuid = ''} = payload.params;
    let {student_id = '', comment , file } = payload.body;

    const transaction = await transaction_repository_obj.start_transaction();

    try {

        if(!is_valid_url(file)) {
            throw Object.assign(new Error(), {name:"BAD_REQUEST", message:"URL is not valid"});
        }

        let session = await session_repository_obj.get_session_by_uuid({uuid,transaction});

        if(!session) { 
            throw Object.assign(new Error(), {name:"NOT_FOUND", message:"Session Not Found"});
        }

        let student = await student_repository_obj.get_student_by_uuid({uuid: student_id, transaction});

        if(!student) { 
            throw Object.assign(new Error(), {name:"NOT_FOUND", message:"Student Not Found"});
        }

        let session_id = session.id;
        let student_id_array = [student.id];

        const justification_statuses = attendance_repository_obj.get_attendance_statuses_for_justification();
        
        let attendance = (await attendance_repository_obj.get_attendance({student_id:student.id, session_id, status:justification_statuses, transaction}));

        if(!attendance) {
            throw Object.assign(new Error(), {name:"CONFLICT", message:"Only attendance status absent and late can be justified"});
        }

        attendance = attendance.toJSON()

        const justified_status = attendance_repository_obj.get_justified_attendance_status();
        const previous_status = attendance.status;

        // If the attendance status is already justified, no need to update it.
        if(justified_status !== previous_status) {
            const payload = {
                status: justified_status,
                previous_status
            }

            let {updated_row_count} = await attendance_repository_obj.update_attendance({session_id,student_id_array,payload,transaction});

            if(updated_row_count === 0) {
                throw Object.assign(new Error(), {name:"CONFLICT", message:"Attendances Not Created"});
            }
        }

        attendance = {...attendance, status: justified_status};
        let attendance_id = attendance.id;

        let justification = {
            attendance_id,
            comment,
            file
        };

        let existing_file_name;

        if(attendance.justification) {
            let previous_justification = attendance.justification;
            existing_file_name = previous_justification.file;
            justification = {...previous_justification,comment,file};
        }

        let created_justification = await justification_repository_obj.upsert_justification({justification, transaction});

        if(!created_justification) {
            throw Object.assign(new Error(), {name:"CONFLICT", message:"Justification Not Created"});
        }

        created_justification = (created_justification).toJSON();

        delete attendance['id'];
        delete attendance['justification'];
        delete created_justification['id'];
        delete created_justification['attendance_id'];

        await store_attendance_marked_event_messages({students:student_id_array, session, status:justified_status, transaction});

        // If the existing file URL in the database is different from the file URL in the request body, delete the old file.
        if(existing_file_name && existing_file_name !== file) {
            await delete_file_from_bucket({name: existing_file_name});
        }
        await transaction_repository_obj.commit_transaction(transaction);
        return {
            ...created_justification,
            attendance
        };
    } catch(error) {
        await transaction_repository_obj.rollback_transaction(transaction);
        throw error;
    }
}

exports.delete_justification = async (payload) => {

    let { uuid = '', student_uuid = '' } = payload.params;

    const transaction = await transaction_repository_obj.start_transaction();

    try {

        let session = await session_repository_obj.get_session_by_uuid({uuid,transaction});

        if(!session) { 
            throw Object.assign(new Error(), {name:"NOT_FOUND", message:"Session Not Found"});
        }

        let student = await student_repository_obj.get_student_by_uuid({uuid: student_uuid, transaction});

        if(!student) { 
            throw Object.assign(new Error(), {name:"NOT_FOUND", message:"Student Not Found"});
        }

        let session_id = session.id;
        let student_id = student.id;

        const justified_attendance_status = attendance_repository_obj.get_justified_attendance_status();
        
        let attendance = (await attendance_repository_obj.get_attendance({student_id:student.id, session_id, status:[justified_attendance_status], transaction}));

        if (!attendance && !attendance?.justification ) {
            throw Object.assign(new Error(), { name: "NOT_FOUND", message: "No justified attendance records found for the specified criteria" });
        }

        attendance = attendance.toJSON();

        let justification = attendance.justification;

        let {
            id: justification_id,
            file: justification_file
        } = justification;

        const payload = {
            status : attendance.previous_status,
            previous_status: attendance.status
        }
        let { updated_rows: [updated_attendance] } = await attendance_repository_obj.update_attendance({ session_id, student_id_array:[student_id], payload, transaction });

        if (!updated_attendance) {
            throw Object.assign(new Error(), { name: "CONFLICT", message: "Attendances Not Updated" });
        }

        let deleted_justifications = await justification_repository_obj.delete_justification({id: justification_id, transaction });

        if (!deleted_justifications || deleted_justifications.length === 0) {
            throw Object.assign(new Error(), { name: "CONFLICT", message: "Justification Not Deleted" });
        }

        const file_name = extract_file_name_from_url(justification_file);
        await delete_file_from_bucket({name: file_name});

        await transaction_repository_obj.commit_transaction(transaction);
        return {
            message: 'Justification Deleted Successfully'
        };
    } catch(error) {
        await transaction_repository_obj.rollback_transaction(transaction);
        throw error;
    }
}

exports.get_upload_url = async (payload) => {

    let { uuid } = payload.params;
    let { name , size, student_uuid, session_number, element_uuid } = payload.query;

    try {
        if (!session_number || session_number.trim() === '' || isNaN(session_number)) {
            throw Object.assign(new Error(), {name:'BAD_REQUEST', message:'Session number not specified'});
        }

        const element = await academic_element_repository_obj.get_element_by_uuid({uuid: element_uuid});
        if(!element) throw Object.assign(new Error(), {name:'NOT_FOUND', message:'Academic element Not Found'});

        const session = await session_repository_obj.get_session_by_uuid({uuid});
        if(!session) throw Object.assign(new Error(), {name:'NOT_FOUND', message:'Session Not Found'});

        const student = await student_repository_obj.get_student_by_uuid({uuid:student_uuid});
        if(!student) throw Object.assign(new Error(), {name:'NOT_FOUND', message:'Student Not Found'});

        const session_id = session.id;
        const student_id = student.id;

        const attendance = await attendance_repository_obj.get_attendance({student_id,session_id});
        if(!attendance) throw Object.assign(new Error(), {name:'NOT_FOUND', message:'Attendance Not Found'});

        const week = session.week;
        const dni = student.dni;
        let abbrevation = element.abbr;
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formatted_date = `${year}${month}${day}`;

        abbrevation = abbrevation.replace(/\s+/g, '');
        session_number = session_number.trim();

        const file_name = `just_s${week}s${session_number.trim()}_${abbrevation}_${dni}_${formatted_date}`;

        const response = await generate_v4_upload_signed_url({name, size, file_name});
        return response;
    } catch (error) {
        throw error;
    }
}

exports.get_read_url = async (payload) => {

    let { uuid } = payload.params;
    let { student_uuid } = payload.query;

    try {
        const session = await session_repository_obj.get_session_by_uuid({uuid});
        if(!session) throw Object.assign(new Error(), {name:'NOT_FOUND', message:'Session Not Found'});

        const student = await student_repository_obj.get_student_by_uuid({uuid:student_uuid});
        if(!student) throw Object.assign(new Error(), {name:'NOT_FOUND', message:'Student Not Found'});

        const session_id = session.id;
        const student_id = student.id;

        const attendance = await attendance_repository_obj.get_attendance({student_id,session_id});
        if(!attendance) throw Object.assign(new Error(), {name:'NOT_FOUND', message:'Attendance Not Found'});

        const justification = attendance.justification;
        const file = justification?.file;

        if(!justification || !file) throw Object.assign(new Error(), {name:'NOT_FOUND', message:'Justification Not Found'});

        const file_name = extract_file_name_from_url(file);

        const response = await get_read_signed_url({name: file_name})
        return response;
    } catch (error) {
        throw error;
    }
}