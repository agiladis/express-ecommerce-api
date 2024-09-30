const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../entities/user');
const transporter = require('../config/mailer');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const activationToken = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    const activationLink = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/activate/${activationToken}`;
    await sendActivationEmail(newUser.email, activationLink);

    res.success(201, newUser, 'User registered successfully');
  } catch (error) {
    res.error(500, error.message, 'Internal server error');
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

const activateAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.error(400, 'bad request', 'Invalid activation link');
    if (user.isVerified) {
      return res.error(
        400,
        'bad request',
        'Your account has been previously activated'
      );
    }

    user.isVerified = true;
    await user.save();

    res.success(200, null, 'Account activated successfully.');
  } catch (error) {
    res.error(500, error.message, 'Internal server error');
  }
};

const sendActivationEmail = async (email, activationLink) => {
  const mailOptions = {
    from: `Express <${process.env.MAIL_SMTP}>`,
    to: email,
    subject: 'Account Activation - Express commerce',
    html: fs
      .readFileSync(
        path.join(__dirname, '../views/activationEmail.ejs'),
        'utf8'
      )
      .replace('<%= activationLink %>', activationLink),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { register, login, activateAccount };
