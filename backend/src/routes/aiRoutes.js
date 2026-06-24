const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/aiController');
const auth    = require('../middleware/auth');

router.post('/chat', auth, ctrl.chat);

module.exports = router;