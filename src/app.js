const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const responseTemplate = require('./middlewares/responseTemplate');
const authMiddleware = require('./middlewares/authMiddleware');
require('./middlewares/responseTemplate');

// to know how body request type
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use response template from middleware
app.use(responseTemplate);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', authMiddleware, productRoutes);

module.exports = app;
