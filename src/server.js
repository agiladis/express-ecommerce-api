const sequelize = require('./config/database');
const app = require('./app');
const User = require('./entities/user');
const Product = require('./entities/product');
const Category = require('./entities/category');
const Order = require('./entities/order');
const OrderItem = require('./entities/orderItem');
const Cart = require('./entities/cart');

const PORT = process.env.PORT || 3000;

// association file
require('./entities/associations');

sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    console.log('Connection to database has been established successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log('Error: ', err));
