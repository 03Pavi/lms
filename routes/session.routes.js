const router = require('express').Router();
const {session_controllers} = require("../controllers");

router.get('/',session_controllers.get_attendance_list);
router.put('/:uuid',session_controllers.update_session);
router.get('/:uuid/students',session_controllers.get_student_list);
router.post('/:uuid/attendances',session_controllers.create_attendances);
router.put('/:uuid/attendances',session_controllers.update_attendances);
router.post('/:uuid/attendances/justifications',session_controllers.create_justification);
router.put('/:uuid/attendances/justifications',session_controllers.update_justification);
router.get('/:uuid/attendances/justifications/upload-url',session_controllers.get_upload_url);
router.get('/:uuid/attendances/justifications/read-url',session_controllers.get_read_url);
router.delete('/:uuid/students/:student_uuid/attendances/justifications',session_controllers.delete_justification);

module.exports = router;