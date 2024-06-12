const { create_leave_schema } = require("../lib/schema");
const { 
    leave_repository_obj,
    leave_policy_repository_obj,
    applicability_repository_obj,
    restriction_repository_obj,
    transaction_repository_obj
} = require("../repositories");

exports.create_leave_policy = async (payload) => {

    let { leave , leave_policy , applicabilities , restriction  } = create_leave_schema.parse(payload.body)

    const transaction = await transaction_repository_obj.start_transaction();

    try {     
        const created_leave = await leave_repository_obj.create_leave({leave, transaction});
        const leave_id = created_leave.id;

        const created_leave_policy = await leave_policy_repository_obj.create_leave_policy({leave_policy: {...leave_policy,leave_id}, transaction});
        const leave_policy_id = created_leave_policy.id;

        // // const created_restriction = await restriction_repository_obj.create_leave_restriction({...restriction,leave_policy_id})

        const created_applicabilities = await applicability_repository_obj.create_leave_applicabilities({applicabilities, transaction});
        
        await created_leave_policy.addApplicabilities(created_applicabilities, { transaction });

        await transaction_repository_obj.commit_transaction(transaction);
        return { 
            leave_data: created_leave,
            leave_policy: created_leave_policy,
            // applicability: created_applicabilities,
            // restriction: created_restriction
        };
    } catch (error) {
        await transaction_repository_obj.rollback_transaction(transaction);
        throw error;
    }
}