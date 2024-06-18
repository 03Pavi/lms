const router = require("express").Router();
const { leave_policy_controllers } = require("../controllers");

router.get("/:uuid", leave_policy_controllers.get_leave_data);
module.exports = router;
