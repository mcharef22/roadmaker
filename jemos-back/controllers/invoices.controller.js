const InvoicesModel = require("../models/invoices.model");
const UserModel = require("../models/user.model");

module.exports.setInvoiceOfUser = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  const invoices = await InvoicesModel.create({
    numInvoice: req.body.numInvoice,
    dateInvoice: req.body.dateInvoice,
    nameProduct: req.body.nameProduct,
    priceProduct: req.body.priceProduct,
    fileInvoice: req.body.fileInvoice,
    user: req.body.user,
  });

  await UserModel.findByIdAndUpdate(
    req.body.user,
    { $push: { invoices: invoices._id } },
    { new: true }
  );

  res.status(200).json(invoices);
};

module.exports.getInvoicesOfUser = async (req, res) => {
  const userId = req.params.id;
  const invoices = await InvoicesModel.find({
    user: userId,
  }).populate("user");
  if (!invoices) {
    return res.status(404).send({
      message: "Invoices not found with id " + req.params.id,
    });
  }
  res.status(200).json(invoices);
};
