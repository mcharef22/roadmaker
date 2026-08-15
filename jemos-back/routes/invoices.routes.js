const express = require("express");
const {
  setInvoiceOfUser,
  getInvoicesOfUser,
} = require("../controllers/invoices.controller");

const router = express.Router();

router.get("/invoices/user/:id", getInvoicesOfUser);
router.post("/invoices", setInvoiceOfUser);

module.exports = router;
