const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DEFAULT_ICON_INDEX_ARRAY = ["Libre"];
const DEFAULT_PACK_VALUE = "Standard";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false, //par défaut un utilisateur n'est pas admin
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  iconIndexArray: {
    type: Array,
    required: false,
    default: DEFAULT_ICON_INDEX_ARRAY,
  },
  pack: {
    type: String,
    required: false,
    default: DEFAULT_PACK_VALUE,
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
  ],
  dateOfCreation: {
    type: Date,
    default: false,
  },
  avatar: {
    type: String,
    required: false,
    default: "",
  },
  billingAddress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "billingAddress",
    },
  ],

  card: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "card",
    },
  ],

  invoices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoices",
    },
  ],
  stripeCustomerId: {
    type: String,
    default: "",
  },
  globalScore: {
    type: Number,
    default: 0,
  },
});

//Méthode pour hasher le mot de passe
userSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//Hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre("save", function (next) {
  if (this.password) {
    this.password = this.hashPassword(this.password);
  }
  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
