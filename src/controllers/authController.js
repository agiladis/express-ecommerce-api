const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../entities/user');
require('dotenv').config();

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

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.error(404, 'bad request', 'Email address is not registered');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.error(404, 'bad request', 'Invalid email or password');

    const token = jwt.sign(
      { id: user.id, email: email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.success(200, token, 'User logged in success');
  } catch (error) {
    res.error(500, error.message, 'Internal server error');
  }
};

module.exports = { register, login };
