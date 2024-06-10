module.exports = {
    teacher_repository_obj: require('./teacher.repositories').teacher_repository_obj,
    session_repository_obj: require('./session.repositories').session_repository_obj,
    student_repository_obj: require('./student.repositories').student_repository_obj,
    attendance_repository_obj: require('./attendance.repositories').attendance_repository_obj,
    transaction_repository_obj: require('./transaction.repositories').transaction_repository_obj,
    justification_repository_obj: require('./justification.repositories').justification_repository_obj,
    academic_group_repository_obj: require('./academic_group.repositories').academic_group_repository_obj,
    academic_period_repository_obj: require('./academic_period.repositories').academic_period_repository_obj,
    academic_element_repository_obj: require('./academic_element.repositories').academic_element_repository_obj,
    outbox_message_repository_obj: require('../message_bus/outbox_message.repositories').outbox_message_repository_obj,
}