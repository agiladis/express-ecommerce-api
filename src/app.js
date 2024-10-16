const express = require('express');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const responseTemplate = require('./middlewares/responseTemplate');
const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const swaggerDocument = require('./openapi.json');

require('./middlewares/responseTemplate');

// to know how body request type
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use response template from middleware
app.use(responseTemplate);

// API Routes
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/carts', authMiddleware, cartRoutes);
app.use('/api/v1/orders', authMiddleware, orderRoutes);

module.exports = app;
