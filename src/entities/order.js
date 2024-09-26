const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Order = sequelize.define('Order', {
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;
