const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Order = sequelize.define('Order', {
  totalPrice: {
    type: DataTypes.INTEGER,
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

Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;
