const transporter = require('../emailConfig');
const config = require('../config');

const emailNotifications = (req, res) => {
  const { name, downDate } = req.body
  const mailOptions = {
    from: config.emailFromAddress,
    to: config.emailToAddress,
    subject: 'Test Email',
    html: `<p>Hello User</p>
  <p>This mail is sent to notify regarding the <b><i>${name}</i></b> service. This service is last down at <b>${downDate}</b>
  <p><br/>Thank You!</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      res.status(200).json({ message: 'Email sent successfully', response: info.response });
    }
  });
}

module.exports = emailNotifications;

