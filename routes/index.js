const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json({
    status: "This is the Attendance Control App",
  });
});
router.use('/organisation', require('./organisation.routes'));
router.use('/leaves', require('./leaves.routes'));

module.exports = router;