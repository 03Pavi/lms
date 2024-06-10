const router = require('express').Router();
const {academic_group_controllers} = require("../controllers");

router.get('/',academic_group_controllers.get_academic_groups);

module.exports = router;