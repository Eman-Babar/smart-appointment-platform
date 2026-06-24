const express   = require('express');
const router    = express.Router();
const pool      = require('../config/db');
const auth      = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE is_active = true ORDER BY name'
    );
    res.json({ success: true, services: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', auth, roleCheck('admin'), async (req, res) => {
  try {
    const { name, description, duration_minutes, price, category } = req.body;
    const result = await pool.query(
      `INSERT INTO services (name, description, duration_minutes, price, category)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, description, duration_minutes, price, category]
    );
    res.status(201).json({ success: true, service: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', auth, roleCheck('admin'), async (req, res) => {
  try {
    const { name, description, duration_minutes, price, category, is_active } = req.body;
    const result = await pool.query(
      `UPDATE services SET name=$1, description=$2, duration_minutes=$3,
       price=$4, category=$5, is_active=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [name, description, duration_minutes, price, category, is_active, req.params.id]
    );
    res.json({ success: true, service: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', auth, roleCheck('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE services SET is_active=false WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;