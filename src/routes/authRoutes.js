const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/signup', register);
router.post('/login', login);
router.get('/activate/:token', )

module.exports = router;
