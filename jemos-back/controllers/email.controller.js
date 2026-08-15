module.exports.sendEmail = async (req, res) => {
  console.log("SMTP désactivé temporairement");
  return res.status(200).json({
    message: "Email désactivé temporairement",
  });
};

module.exports.sendEmailToUser = async (req, res) => {
  console.log("SMTP désactivé temporairement");
  return res.status(200).json({
    message: "Email désactivé temporairement",
  });
};
