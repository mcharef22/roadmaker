const BillingAddress = require("../models/billingAddress.model.js");
const UserModel = require("../models/user.model.js");

module.exports.getUserBillingAddress = async (req, res) => {
  const userId = req.params.id;
  const billingAddress = await BillingAddress.findOne({
    user: userId,
  }).populate("user");
  if (!billingAddress) {
    return res.status(404).send({
      message: "Billing address not found with id " + req.params.id,
    });
  }
  res.status(200).json(billingAddress);
};

module.exports.getUserBillingAddresses = async (req, res) => {
  const userId = req.params.id;
  const billingAddresses = await BillingAddress.find({
    user: userId,
  }).populate("user");
  if (!billingAddresses) {
    return res.status(404).send({
      message: "Billing address not found with id " + req.params.id,
    });
  }
  res.status(200).json(billingAddresses);
};

module.exports.selectedUserBillingAddress = async (req, res) => {
  const userId = req.params.userId;
  const selectedBillingAddressId = req.params.id;

  if (!selectedBillingAddressId) {
    return res.status(400).send({ message: "Invalid ID" });
  }

  try {
    await BillingAddress.updateMany(
      { user: userId },
      { $set: { selected: false } }
    );

    const updateBillingAddress = await BillingAddress.findByIdAndUpdate(
      selectedBillingAddressId,
      {
        $set: { selected: true },
      }
    );
    res.status(200).json(updateBillingAddress);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.setBillingAddress = async (req, res) => {
  console.log(req.body);
  const billingAddress = await BillingAddress.create({
    firstAndLastName: req.body.firstAndLastName,
    country: req.body.country,
    address: req.body.address,
    additionalAddress: req.body.additionalAddress,
    city: req.body.city,
    zipCode: req.body.zipCode,
    corporateName: req.body.corporateName,
    siret: req.body.siret,
    user: req.body.user,
  });

  await UserModel.findByIdAndUpdate(
    req.body.user,
    { $push: { billingAddress: billingAddress._id } },
    { new: true }
  );
  res.status(200).json(billingAddress);
};

module.exports.editBillingAddress = async (req, res) => {
  const billingAddress = await BillingAddress.findById(req.params.id);
  if (!billingAddress) {
    res
      .status(404)
      .send({ message: "Billing address not found with id " + req.params.id });
  }

  const updateBillingAddress = await BillingAddress.findByIdAndUpdate(
    billingAddress,
    req.body,
    { new: true }
  );
  res.status(200).json(updateBillingAddress);
};

module.exports.deleteBillingAddress = async (req, res) => {
  const billingAddress = await BillingAddress.findById(req.params.id);

  if (!billingAddress) {
    res
      .status(404)
      .send({ message: "Billing address not found with id " + req.params.id });
  }

  await BillingAddress.deleteOne({ _id: req.params.id });
  res.status(200).json({
    message: "Billing address" + billingAddress.id + " deleted successfully!",
  });
};
