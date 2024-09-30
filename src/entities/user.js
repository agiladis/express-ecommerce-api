const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  phoneNumber: { type: DataTypes.STRING, unique: true },
  dateOfBirth: DataTypes.DATE,
  address: DataTypes.TEXT,
  gender: {
    type: DataTypes.ENUM,
    values: ['FEMALE', 'MALE'],
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = User;
