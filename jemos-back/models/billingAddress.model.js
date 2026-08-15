const mongoose = require("mongoose");

const billingAddressSchema = new mongoose.Schema({
  firstAndLastName: {
    type: String,
    required: true,
    default: "",
  },

  country: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
    default: "",
  },

  additionalAddress: {
    type: String,
    required: false,
    default: "",
  },

  city: {
    type: String,
    required: true,
    default: "",
  },

  zipCode: {
    type: String,
    required: true,
    default: "",
  },

  corporateName: {
    type: String,
    required: false,
    default: "",
  },

  siret: {
    type: String,
    required: false,
  },

  selected: {
    type: Boolean,
    default: false,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const BillingAddress = mongoose.model("billingAddress", billingAddressSchema);
module.exports = BillingAddress;
