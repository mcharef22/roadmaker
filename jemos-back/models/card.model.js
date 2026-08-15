const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "",
  },
  numCard: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
    default: "",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

cardSchema.methods.hashPassword = function (numCard) {
  return bcrypt.hashSync(numCard, bcrypt.genSaltSync(10));
};

cardSchema.pre("save", function (next) {
  if (this.numCard) {
    this.numCard = this.hashPassword(this.numCard);
  }
  next();
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
