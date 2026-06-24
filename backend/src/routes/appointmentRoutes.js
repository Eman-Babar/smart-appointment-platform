const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/appointmentController');
const auth       = require('../middleware/auth');
const roleCheck  = require('../middleware/roleCheck');
const pool       = require('../config/db');
router.get ('/',          auth, roleCheck('admin'), ctrl.getAllAppointments);
router.get ('/my',        auth, ctrl.getMyAppointments);
router.post('/',          auth, ctrl.bookAppointment);
router.put ('/:id/cancel',  auth, ctrl.cancelAppointment);
router.put ('/:id/approve', auth, roleCheck('admin'), ctrl.approveAppointment);
router.put ('/:id/reject',  auth, roleCheck('admin'), ctrl.rejectAppointment);
router.put('/:id/complete', auth, roleCheck('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE appointments SET status = 'completed', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    res.json({ success: true, message: 'Marked as completed', appointment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
module.exports = router;