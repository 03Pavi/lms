const { teacher_service } = require('../services');
const { handle_error } = require('../lib/error_handler');


exports.get_teacher_detail = async (req, res) => {
    try {
        const response = await teacher_service.get_teacher_detail(req);
        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while getting teacher details: ", error);
        handle_error(res, error);
    }
}