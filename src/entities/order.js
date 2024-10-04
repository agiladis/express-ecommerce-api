const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: [
      'WAITING_PAYMENT',
      'PAID',
      'PENDING',
      'SHIPPED',
      'DELIVERED',
      'CANCELED',
      'COMPLETED',
    ],
    defaultValue: 'WAITING_PAYMENT',
    allowNull: false,
  },
});

module.exports = Order;
