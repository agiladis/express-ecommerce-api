const { body, validationResult } = require('express-validator');

const validateEmail = [
  body('email').isEmail().withMessage('Email must be valid'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error(400, errors.array());
    }

    next();
  },
];

module.exports = validateEmail;
