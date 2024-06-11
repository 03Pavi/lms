const router = require('express').Router();
const {leave_policy_controllers} = require("../controllers");

router.post('/:uuid/leave-policies',leave_policy_controllers.create_leave_policy);

module.exports = router;