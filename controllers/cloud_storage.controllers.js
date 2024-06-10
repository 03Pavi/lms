const { cloud_storage_service } = require("../services");
const { handle_error } = require('../lib/error_handler'); 

exports.set_cors = async (req, res) => {
    try {
        const cors = await cloud_storage_service.set_cors({data: req.body});
        return res.send(cors);
    } catch (error) {
        console.log('Error while setting cors', error);
        handle_error(res, error);
    }
}
