const bcrypt = require('bcrypt');
const User = require('../entities/user');
const e = require('express');

const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.success(201, newUser, 'User registered successfully');
  } catch (error) {
    res.error(400, error.message, 'Error registering user');
  }
};

module.exports = { register };
