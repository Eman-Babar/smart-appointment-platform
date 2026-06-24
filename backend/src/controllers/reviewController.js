const pool = require('../config/db');

// Submit review
exports.submitReview = async (req, res) => {
  try {
    const { appointment_id, rating, comment } = req.body;

    if (!appointment_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Appointment and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check appointment belongs to user and is completed
    const appt = await pool.query(
      `SELECT a.*, s.name as service_name
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [appointment_id, req.user.id]
    );

    if (appt.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appt.rows[0].status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed appointments'
      });
    }

    // Check already reviewed
    const existing = await pool.query(
      'SELECT id FROM reviews WHERE appointment_id = $1',
      [appointment_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this appointment'
      });
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, appointment_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, appointment_id, rating, comment || null]
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get my reviews
exports.getMyReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, s.name as service_name, a.appointment_date
       FROM reviews r
       JOIN appointments a ON r.appointment_id = a.id
       JOIN services s ON a.service_id = s.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, reviews: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all reviews (admin)
exports.getAllReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, s.name as service_name,
              u.name as user_name, u.email,
              a.appointment_date
       FROM reviews r
       JOIN appointments a ON r.appointment_id = a.id
       JOIN services s ON a.service_id = s.id
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );
    res.json({ success: true, reviews: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get service reviews (public)
exports.getServiceReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.rating, r.comment, r.created_at,
              u.name as user_name, s.name as service_name
       FROM reviews r
       JOIN appointments a ON r.appointment_id = a.id
       JOIN services s ON a.service_id = s.id
       JOIN users u ON r.user_id = u.id
       WHERE a.service_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.service_id]
    );

    const avgRating = result.rows.length > 0
      ? (result.rows.reduce((sum, r) => sum + r.rating, 0) / result.rows.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      reviews: result.rows,
      average_rating: parseFloat(avgRating),
      total_reviews: result.rows.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Check if appointment is reviewed
exports.checkReviewed = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id FROM reviews WHERE appointment_id = $1 AND user_id = $2',
      [req.params.appointment_id, req.user.id]
    );
    res.json({ success: true, reviewed: result.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};