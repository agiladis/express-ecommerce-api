const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader)
    return res.error(
      401,
      'unauthorized',
      'no token provided, authorization denied'
    );
  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    res.error(401, 'unauthorized', 'Token is not valid');
  }
};

module.exports = authMiddleware;
