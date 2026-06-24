const pool = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [users, appointments, services, revenue] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['customer']),
      pool.query('SELECT COUNT(*) FROM appointments'),
      pool.query('SELECT COUNT(*) FROM services WHERE is_active = true'),
      pool.query(`SELECT COALESCE(SUM(s.price), 0) as total
                  FROM appointments a
                  JOIN services s ON a.service_id = s.id
                  WHERE a.status = 'completed'`),
    ]);

    const trending = await pool.query(
      `SELECT s.name, COUNT(a.id) as bookings
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       GROUP BY s.name ORDER BY bookings DESC LIMIT 5`
    );

    const monthly = await pool.query(
      `SELECT TO_CHAR(appointment_date, 'Mon') as month,
              COUNT(*) as count
       FROM appointments
       WHERE appointment_date >= NOW() - INTERVAL '6 months'
       GROUP BY month, DATE_TRUNC('month', appointment_date)
       ORDER BY DATE_TRUNC('month', appointment_date)`
    );

    const byStatus = await pool.query(
      `SELECT status, COUNT(*) as count
       FROM appointments GROUP BY status`
    );

    res.json({
      success: true,
      stats: {
        total_users:        parseInt(users.rows[0].count),
        total_appointments: parseInt(appointments.rows[0].count),
        total_services:     parseInt(services.rows[0].count),
        total_revenue:      parseFloat(revenue.rows[0].total),
        trending_services:  trending.rows,
        monthly_bookings:   monthly.rows,
        by_status:          byStatus.rows,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
  exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, phone, created_at,
              (SELECT COUNT(*) FROM appointments WHERE user_id = users.id) as total_appointments
       FROM users
       ORDER BY created_at DESC`
    );
    res.json({ success: true, users: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
};