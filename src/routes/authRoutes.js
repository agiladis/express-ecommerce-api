const express = require('express');
const router = express.Router();
const {
  register,
  login,
  activateAccount,
} = require('../controllers/authController');
const validateRegister = require('../middlewares/validateRegister');

router.post('/signup', validateRegister, register);
router.post('/login', login);
router.get('/activate/:token', activateAccount);

module.exports = router;
