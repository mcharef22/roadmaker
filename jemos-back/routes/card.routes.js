const express = require("express");
const {
  setCardOfUser,
  editCard,
  getCardOfUser,
  getStripePaymentMethods,
  attachStripePaymentMethod,
  detachStripePaymentMethod,
  createPaymentIntent,
} = require("../controllers/card.controller");

const router = express.Router();

router.get("/card/user/:id", getCardOfUser);
router.post("/card", setCardOfUser);
router.put("/card/:id", editCard);
router.get("/stripe/payment-methods/:customerId", getStripePaymentMethods);
router.post("/stripe/payment-methods/attach", attachStripePaymentMethod);
router.delete(
  "/stripe/payment-methods/:paymentMethodId",
  detachStripePaymentMethod,
);
router.post("/stripe/payment-intent", createPaymentIntent);

module.exports = router;
