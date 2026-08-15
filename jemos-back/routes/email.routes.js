const express = require("express");

const {
  sendEmail,
  sendEmailToUser,
} = require("../controllers/email.controller");

const router = express.Router();

router.post("/email", sendEmail);
router.post("/email/user", sendEmailToUser);

module.exports = router;
