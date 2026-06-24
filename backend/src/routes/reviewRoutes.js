const express   = require('express');
const router    = express.Router();
const ctrl      = require('../controllers/reviewController');
const auth      = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/',                              auth, ctrl.submitReview);
router.get ('/my',                            auth, ctrl.getMyReviews);
router.get ('/all',  auth, roleCheck('admin'), ctrl.getAllReviews);
router.get ('/check/:appointment_id',         auth, ctrl.checkReviewed);
router.get ('/service/:service_id',                 ctrl.getServiceReviews);

module.exports = router;