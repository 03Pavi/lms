const { student_sort_columns } = require("./constants");
const { nanoid } = require('nanoid');
const mime = require('mime-types')

function generate_pagination_info(page, limit, sort_column, sort_order) {

  const min_limit = 50;
  const max_limit = 150;
  const interval = 50;

  let orders = ['asc', 'desc'];
  let sort_item = student_sort_columns[sort_column.toLowerCase()];

  sort_order = orders.includes(sort_order.toLowerCase()) ? sort_order.toLowerCase() : 'asc';
  sort_column = sort_item ? sort_item : student_sort_columns['name'];

  page = Math.abs(parseInt(page)) || 1;
  limit = Math.abs(parseInt(limit)) || 10;

  if (limit < min_limit) {
    limit = min_limit;
  } else if (limit > max_limit) {
    limit = max_limit;
  } else {
    limit = Math.ceil(limit / interval) * interval;
  }

  page = page >= 1 ? page - 1 : 0;

  const offset = page * limit;

  return { limit, offset, page, sort_column, sort_order };

}

function genrate_sessions(settings) {
  let { sessions_amount, sessions_per_week, hours_per_session, group_id } = settings;

  if (!sessions_amount || !sessions_per_week || !group_id) {
    return [];
  }

  const sessions = [];
  sessions_per_week = parseInt(sessions_per_week);
  sessions_amount = parseInt(sessions_amount);
  hours_per_session = parseInt(hours_per_session);

  for (let i = 0; i < sessions_amount; i++) {
    const week = Math.floor(i / sessions_per_week) + 1;
    const hours = hours_per_session;
    sessions.push({
      group_id,
      week,
      hours
    });
  }

  return sessions;
}

function genrate_attendances(students, sessions) {
  const attendances = [];

  for (const student of students) {
    for (const session of sessions) {
      const attendanceRecord = {
        student_id: student.id,
        session_id: session.id,
        status: null
      };

      attendances.push(attendanceRecord);
    }
  }

  return attendances;

}

function update_attendance_with_uuid(attendances = [], students = []) {
  const id_to_uuid_map = new Map();

  students.forEach(student => {
    if (student.dataValues && student.dataValues.id !== undefined && student.dataValues.uuid !== undefined) {
      id_to_uuid_map.set(student.dataValues.id, student.dataValues.uuid);
    }
  });

  for (let i = 0; i < attendances.length; i++) {
    const student_id = attendances[i].dataValues.student_id;

    if (id_to_uuid_map.has(student_id)) {
      attendances[i].dataValues.student_id = id_to_uuid_map.get(student_id);
    }

    delete attendances[i].dataValues.id;
    delete attendances[i].dataValues.session_id;
    delete attendances[i].dataValues.previous_status;
  }

  return attendances;
}

function transformed_students(students) {
  return students.map((student) => ({
    uuid: student.uuid,
    first_name: student.firstname,
    last_name: student.lastname,
    dni: student.dni
  }));
}

function filtered_status (status, available_attendance_status) {
  const filtered_attendance_statuses = [];

  status.forEach((value) => {
    value = value.toLowerCase();
    if(available_attendance_status.includes(value)) {
      filtered_attendance_statuses.push(value)
    }
  });

  return filtered_attendance_statuses;
}

function get_gcp_content_type ({ file_extension }) {
  if (!file_extension) throw new bad_request('File extension not present');
  return mime.lookup(file_extension.toLowerCase()) || 'application/octet-stream';
};

function get_nanoid () {
  return nanoid();
};

function is_valid_url(url) {
  try {
    let response = new URL(url);
    return (response !== null);
  } catch (error) {
    return false;
  }
};

const extract_file_name_from_url = (file_url) => {
  try {
    const parsed_url = new URL(file_url);
    const path_name = parsed_url.pathname;
    const parts = path_name.split('/');
    return parts[parts.length - 1];
  } catch (error) {
    throw Object.assign(new Error(), {name:"BAD_REQUEST", message:"URL is not valid"});
  }
};

module.exports = {
  generate_pagination_info,
  genrate_sessions,
  genrate_attendances,
  update_attendance_with_uuid,
  transformed_students,
  filtered_status,
  is_valid_url,
  get_gcp_content_type,
  get_nanoid,
  extract_file_name_from_url
};
