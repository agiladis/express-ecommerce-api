const nodemailer = require('nodemailer');
require('dotenv').config();

const { SERVICE, SERVER_SMTP, EMAIL_SMTP, PASS_SMTP } = process.env;

const transporter = nodemailer.createTransport({
  host: SERVER_SMTP,
  service: SERVICE,
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_SMTP,
    pass: PASS_SMTP,
  },
});

module.exports = transporter;
