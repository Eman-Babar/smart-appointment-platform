const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const auth    = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT rh.preferred_day, rh.preferred_time, s.name as service_name,
              s.id as service_id, SUM(rh.score) as total_score
       FROM recommendation_history rh
       JOIN services s ON rh.service_id = s.id
       WHERE rh.user_id = $1
       GROUP BY rh.preferred_day, rh.preferred_time, s.name, s.id
       ORDER BY total_score DESC
       LIMIT 3`,
      [req.user.id]
    );
    res.json({ success: true, recommendations: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;