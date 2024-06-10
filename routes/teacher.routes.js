const router = require('express').Router();
const {teacher_controllers} = require("../controllers");

router.get('/:email_id',teacher_controllers.get_teacher_detail);

module.exports = router;