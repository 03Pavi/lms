const { academic_group_service } = require('../services');
const { handle_error } = require('../lib/error_handler');

exports.get_academic_groups = async (req,res) => {
    try {
        const response = await academic_group_service.get_academic_groups(req);
        if(!response || response.length === 0) {
            return res.status(204).json({message:"No content found"});
        }
        return res.status(200).send(response);
    } catch(error) {
        console.log("Error while fetching academic groups: ", error);
        handle_error(res, error);
    }
}