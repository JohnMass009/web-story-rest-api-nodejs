const nodemailer = require('nodemailer');
const logger = require('../core/logger');
const { domain, environment, smtp } = require('../config/config');

const transport = nodemailer.createTransport(smtp);

if (environment !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

const sendEmail = async (to, subject, text) => {
  const message = { from: smtp.from, to, subject, text };
  await transport.sendMail(message, (error, info) => {
    if (error)
      logger.error(error.message)

    logger.info(`Email sent: ${info}`);
  });
};

const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `${domain}/reset-password?token=${token}`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  Ignore this email, if you did not request any password resets.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
};