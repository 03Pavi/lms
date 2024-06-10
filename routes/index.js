const router = require("express").Router();
const { cloud_storage_controller } = require("../controllers");

router.get("/", (req, res, next) => {
  res.json({
    status: "This is the Attendance Control App",
  });
});

router.use('/teachers', require('./teacher.routes'));
router.use('/leave', require('./leave.route'));
router.use('/sessions', require('./session.routes'));
router.use('/academic-groups', require('./academic_group.routes'));
router.put("/set-cors", cloud_storage_controller.set_cors);

module.exports = router;