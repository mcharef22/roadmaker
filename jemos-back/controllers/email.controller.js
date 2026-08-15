const nodemailer = require("nodemailer");
const config = require("../config.json");

const transporter = nodemailer.createTransport({
  host: config.SMTP.HOST,
  port: config.SMTP.PORT,
  secure: false,
  auth: {
    user: config.SMTP.USER,
    pass: config.SMTP.PASSWORD,
  },
});

module.exports.sendEmail = async (req, res) => {
  const { email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: config.SMTP.USER,
    replyTo: email,
    subject: subject,
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
    from: config.SMTP.USER,
    to: email,
    subject: subject,
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
