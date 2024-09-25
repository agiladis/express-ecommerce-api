const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const responseTemplate = require('./middlewares/responseTemplate');
require('./middlewares/responseTemplate');

// to know how body request type
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use middleware
app.use(responseTemplate);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Hello world');
});

module.exports = app;
