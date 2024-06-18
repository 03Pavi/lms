const { leave_service } = require("../services");
const { handle_error } = require("../lib/error_handler");

exports.get_leaves_by_orgainisation_id = async (req, res) => {
  try {
    const response = await leave_service.get_leaves_by_orgainisation_id(req);
    if (!response) {
      return res.status(204).json({ message: "No content found" });
    }
    return res.status(200).send(response);
  } catch (error) {
    console.log("Error while getting leaves list: ", error);
    handle_error(res, error);
  }
};
