const express = require('express');
const router = express.Router();
const {
  register,
  login,
  activateAccount,
  resendActivationToken,
} = require('../controllers/authController');
const validateRegister = require('../middlewares/validateRegister');
const validateEmail = require('../middlewares/validateEmail');

router.post('/signup', validateRegister, register);
router.post('/login', validateEmail, login);
router.get('/activate/:token', activateAccount);
router.post('/reactivate', resendActivationToken);

module.exports = router;
