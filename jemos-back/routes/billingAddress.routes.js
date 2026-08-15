const express = require("express");

const {
  getUserBillingAddress,
  getUserBillingAddresses,
  setBillingAddress,
  editBillingAddress,
  deleteBillingAddress,
  selectedUserBillingAddress,
} = require("../controllers/billingAddress.controller");

const router = express.Router();

router.get("/billingAddress/user/:id", getUserBillingAddress);
router.get("/billingAddresses/user/:id", getUserBillingAddresses);
router.post("/billingAddress", setBillingAddress);
router.put("/billingAddress/:id", editBillingAddress);
router.delete("/billingAddress/:id", deleteBillingAddress);
router.put(
  "/invoiceBillingAddress/user/:userId/:id",
  selectedUserBillingAddress
);

module.exports = router;
