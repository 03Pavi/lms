const { leave_policy_service } = require('../services');
const { handle_error } = require('../lib/error_handler');

exports.create_leave_policy = async (req, res) => {
    try {
        const response = await leave_policy_service.create_leave_policy(req);
        return res.status(201).send(response);
    } catch (error) {
        console.log("Error while creating leave policy : ", error);
        handle_error(res, error);
    }
}
exports.get_leave_policy_by_leave_id = async (req, res) => {
    try {
        const response = await leave_policy_service.get_leave_data(req);
        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while creating leave policy : ", error);
        handle_error(res, error);
    }
}