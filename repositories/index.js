module.exports = {
    leave_repository_obj: require('./leave.repositories').leave_repository_obj,
    leave_policy_repository_obj: require('./leave_policy.repositories').leave_policy_repository_obj,
    applicability_repository_obj: require('./applicability.repositories').applicability_repository_obj,
    exception_repository_obj: require('./exception.repositories').exception_repository_obj,
    restriction_repository_obj: require('./restriction.repositories').restriction_repository_obj,
    transaction_repository_obj: require('./transaction.repositories').transaction_repository_obj,
    outbox_message_repository_obj: require('../message_bus/outbox_message.repositories').outbox_message_repository_obj,
}