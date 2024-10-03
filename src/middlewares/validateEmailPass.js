const { body, validationResult } = require('express-validator');

const validateEmailPass = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error(400, errors.array());
    }

    next();
  },
];

module.exports = validateEmailPass;
