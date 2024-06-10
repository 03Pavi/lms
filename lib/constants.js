const http_status_code = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER: 500,
};

const student_sort_columns = {
    id: { sort_key : 'id', label : 'Incremental ID' },
    dni: { sort_key : 'dni', label : 'ID' },
    name: { sort_key : 'last_name', label : 'Student\'s full name' },
    practical_absence_hours: { sort_key : 'practical_absence_hours', label : 'Practical absences', session_type: 'practical' },
    theoretical_absence_hours: { sort_key : 'theoretical_absence_hours', label : 'Theoretical/Practical absences', session_type: 'theoretical_practical' },
    practical_absence_percentage: { sort_key : 'practical_absence_hours', label : 'Percentage of absence practical type', session_type: 'practical' },
    theoretical_absence_percentage: { sort_key : 'theoretical_absence_hours', label : 'Percentage of absence theoretical/practical type', session_type: 'theoretical_practical' }
}

const max_file_size = 3145728;

const allowed_file_types = ['pdf', 'doc', 'docx', 'odt'];

const storage_base_url = 'https://storage.cloud.google.com';

module.exports = {
    http_status_code,
    student_sort_columns,
    max_file_size,
    allowed_file_types,
    storage_base_url,
};