const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports.sendEmail = async (req, res) => {
  const { email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.SMTP_USER,
    replyTo: email,
    subject,
    html: message,
    attachments: [
      {
        filename: "jemos_logo.png",
        path: "./imgs/jemos_logo.png",
        cid: "logo",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json(info.response);
    }
  });
};

module.exports.sendEmailToUser = async (req, res) => {
  const { email, subject, message } = req.body;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    html: message,
    attachments: [
      {
        filename: "jemos_logo.png",
        path: "./imgs/jemos_logo.png",
        cid: "logo",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json(info.response);
    }
  });
};
