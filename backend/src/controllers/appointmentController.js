const pool = require('../config/db');

exports.getMyAppointments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, s.name as service_name, s.duration_minutes, s.price
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.user_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [req.user.id]
    );
    res.json({ success: true, appointments: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, s.name as service_name, u.name as user_name, u.email
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       JOIN users u ON a.user_id = u.id
       ORDER BY a.appointment_date DESC`
    );
    res.json({ success: true, appointments: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const { service_id, appointment_date, appointment_time, notes } = req.body;

    if (!service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const conflict = await pool.query(
      `SELECT id FROM appointments
       WHERE service_id = $1 AND appointment_date = $2
       AND appointment_time = $3 AND status != 'cancelled'`,
      [service_id, appointment_date, appointment_time]
    );
    if (conflict.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'This slot is already booked' });
    }

    const result = await pool.query(
      `INSERT INTO appointments (user_id, service_id, appointment_date, appointment_time, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, service_id, appointment_date, appointment_time, notes || null]
    );

    await pool.query(
      `INSERT INTO recommendation_history (user_id, service_id, preferred_day, preferred_time, score)
       VALUES ($1, $2, $3, $4, 1)
       ON CONFLICT DO NOTHING`,
      [
        req.user.id,
        service_id,
        new Date(appointment_date).toLocaleDateString('en-US', { weekday: 'long' }),
        appointment_time < '12:00' ? 'Morning' : appointment_time < '17:00' ? 'Afternoon' : 'Evening'
      ]
    );

    res.status(201).json({ success: true, message: 'Appointment booked!', appointment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE appointments SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND status NOT IN ('cancelled','completed')
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.approveAppointment = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE appointments SET status = 'confirmed', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    res.json({ success: true, message: 'Appointment confirmed', appointment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.rejectAppointment = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE appointments SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    res.json({ success: true, message: 'Appointment rejected', appointment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};