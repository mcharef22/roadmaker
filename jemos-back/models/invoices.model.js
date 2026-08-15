const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  numInvoice: {
    type: Number,
    required: false,
  },

  dateInvoice: {
    type: Date,
    required: false,
  },
  nameProduct: {
    type: String,
    required: false,
  },
  priceProduct: {
    type: Number,
    required: false,
  },
  fileInvoice: {
    type: String,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});
invoiceSchema.pre("save", async function (next) {
  try {
    if (!this.numInvoice) {
      const latestInvoice = await this.constructor.findOne(
        {},
        {},
        { sort: { numInvoice: -1 } }
      );
      this.numInvoice = latestInvoice ? latestInvoice.numInvoice + 1 : 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
