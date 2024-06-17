const router = require('express').Router();
const {leave_policy_controllers, leave_controllers} = require("../controllers");

router.post('/:uuid/leave-policies',leave_policy_controllers.create_leave_policy);
router.get('/:uuid/leaves',leave_controllers.get_leaves_by_orgainisation_id);
module.exports = router;