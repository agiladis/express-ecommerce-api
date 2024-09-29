require('dotenv').config();

const nodemailer = require('nodemailer');

const { SERVICE, SERVER_SMTP, MAIL_SMTP, PASS_SMTP } = process.env;

const transporter = nodemailer.createTransport({
  host: SERVER_SMTP,
  service: SERVICE,
  port: 465,
  secure: true,
  auth: {
    user: MAIL_SMTP,
    pass: PASS_SMTP,
  },
});

module.exports = transporter;
