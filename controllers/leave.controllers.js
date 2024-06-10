const { leave_service } = require('../services');
const { handle_error } = require('../lib/error_handler');

exports.create_leave = async (req, res) => {
    try {
        const response = await leave_service.create_leave(req);
        
        if(!response) {
            return res.status(204).json({message:"No content found"});
        }

        return res.status(200).send(response);
    } catch (error) {
        console.log("Error while getting attendance list: ", error);
        handle_error(res, error);
    }
}