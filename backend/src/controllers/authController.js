const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email aur password zaroori hain'
      });
    }

    // Email already exist karta hai?
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Yeh email pehle se registered hai'
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, 'customer')
       RETURNING id, name, email, role, phone, created_at`,
      [name, email, password_hash, phone || null]
    );

    const user  = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account ban gaya!',
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email aur password dono chahiye'
      });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai'
      });
    }

    const user  = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login ho gaya!',
      token,
      user: {
        id: user.id, name: user.name,
        email: user.email, role: user.role, phone: user.phone
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const result = await pool.query(
      `UPDATE users SET name = $1, phone = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, role, phone`,
      [name, phone, req.user.id]
    );
    res.json({ success: true, message: 'Profile update ho gaya!', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};