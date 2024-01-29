const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
  
  service: config.emailService,
  auth: {
    user: config.emailFromAddress,
    pass: config.emailPassword,
  },
});

module.exports = transporter;
