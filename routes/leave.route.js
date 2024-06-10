const router = require('express').Router();
const {leave_controllers} = require("../controllers");

// router.get('/',leave_controllers.get_leaves);
// router.get('/:uuid',leave_controllers.get_leave);
router.post('/',leave_controllers.create_leave);
// router.post('/:uuid',leave_controllers.update_leave);
module.exports = router;