const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const responseTemplate = require('./middlewares/responseTemplate');
const authMiddleware = require('./middlewares/authMiddleware');
require('./middlewares/responseTemplate');

// to know how body request type
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use middleware
app.use(responseTemplate);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.get('/api/v1/protected', authMiddleware, (req, res) => {
  res.send('Hello world');
});

module.exports = app;
