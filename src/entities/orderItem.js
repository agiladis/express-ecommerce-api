const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product');

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = OrderItem;
