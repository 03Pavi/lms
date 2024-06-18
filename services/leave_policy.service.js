const { create_leave_schema } = require("../lib/schema");
const {
    leave_repository_obj,
    leave_policy_repository_obj,
    applicability_repository_obj,
    exception_repository_obj,
    restriction_repository_obj,
    transaction_repository_obj
} = require("../repositories");

exports.create_leave_policy = async (payload) => {

    let { leave, leave_policy, applicabilities = [], exceptions = [], restriction } = create_leave_schema.parse(payload.body);
    let { clubbed_leaves = [] } = restriction;
    const transaction = await transaction_repository_obj.start_transaction();

    try {

        const created_leave = await leave_repository_obj.create_leave({ leave, transaction });
        const leave_id = created_leave.id;

        const created_leave_policy = await leave_policy_repository_obj.create_leave_policy({ leave_policy: { ...leave_policy, leave_id }, transaction });

        const leave_policy_id = created_leave_policy.id;

        const leaves = await leave_repository_obj.get_leaves_by_uuid({ clubbed_leaves, transaction });

        const created_restriction = await restriction_repository_obj.create_leave_restriction({ restriction: { ...restriction, leave_policy_id }, transaction });

        await created_restriction.addClubbed_leaves(leaves, { transaction });

        const created_exceptions = await exception_repository_obj.create_leave_exceptions({ exceptions, transaction });
        const created_applicabilities = await applicability_repository_obj.create_leave_applicabilities({ applicabilities, transaction });

        await created_leave_policy.addExceptions(created_exceptions, { transaction });
        await created_leave_policy.addApplicabilities(created_applicabilities, { transaction });

        await transaction_repository_obj.commit_transaction(transaction);
        return {
            leave_data: created_leave,
            leave_policy: created_leave_policy,
            restriction: created_restriction,
            applicabilities: created_applicabilities,
            exceptions: created_exceptions
        };
    } catch (error) {
        await transaction_repository_obj.rollback_transaction(transaction);
        throw error;
    }
}
exports.get_leave_data = async (payload) => {

    let { uuid } = payload.params
    const transaction = await transaction_repository_obj.start_transaction();

    try {

        const { leave_policy } = await leave_repository_obj.get_leave_data_by_leave_uuid({ uuid, transaction });
        await transaction_repository_obj.commit_transaction(transaction);
        return {
            leave_policy: leave_policy,
        };
    } catch (error) {
        await transaction_repository_obj.rollback_transaction(transaction);
        throw error;
    }
}
