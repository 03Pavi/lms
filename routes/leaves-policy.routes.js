const router = require('express').Router();
const { leave_policy_controllers } = require("../controllers");

router.get('/:uuid', leave_policy_controllers.get_leave_policy_by_leave_id);
module.exports = router;