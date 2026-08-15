const CardModel = require("../models/card.model");
const UserModel = require("../models/user.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports.setCardOfUser = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  const card = await CardModel.create({
    name: req.body.name,
    numCard: req.body.numCard,
    expirationDate: req.body.expirationDate,
    user: req.body.user,
  });

  await UserModel.findByIdAndUpdate(
    req.body.user,
    { $push: { card: card._id } },
    { new: true },
  );
  res.status(200).json(card);
};

module.exports.editCard = async (req, res) => {
  const card = await CardModel.findById(req.params.id);
  if (!card) {
    res
      .status(404)
      .send({ message: "Card not found with id " + req.params.id });
  }

  if (req.body.numCard) {
    req.body.numCard = card.hashPassword(req.body.numCard);
  }

  const updateCard = await CardModel.findByIdAndUpdate(card, req.body, {
    new: true,
  });
  res.status(200).json(updateCard);
};

module.exports.getCardOfUser = async (req, res) => {
  const userId = req.params.id;
  const card = await CardModel.findOne({
    user: userId,
  }).populate("user");
  if (!card) {
    return res.status(404).send({
      message: "Card not found with id " + req.params.id,
    });
  }
  res.status(200).json(card);
};

module.exports.getStripePaymentMethods = async (req, res) => {
  try {
    const { customerId } = req.params;

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    res.status(200).json(paymentMethods.data);
  } catch (error) {
    console.error("Erreur récupération cartes Stripe :", error);

    res.status(500).json({
      message: "Erreur lors de la récupération des cartes Stripe",
    });
  }
};

module.exports.attachStripePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId, customerId } = req.body;

    if (!paymentMethodId || !customerId) {
      return res.status(400).json({
        message: "paymentMethodId et customerId sont requis",
      });
    }

    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    res.status(200).json(paymentMethod);
  } catch (error) {
    console.error("Erreur ajout carte Stripe :", error);

    res.status(500).json({
      message: "Erreur lors de l'ajout de la carte Stripe",
    });
  }
};

module.exports.detachStripePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;

    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

    res.status(200).json(paymentMethod);
  } catch (error) {
    console.error("Erreur suppression carte Stripe :", error);

    res.status(500).json({
      message: "Erreur lors de la suppression de la carte Stripe",
    });
  }
};

module.exports.createPaymentIntent = async (req, res) => {
  try {
    const {
      paymentMethodId,
      customerId,
      amount,
      currency = "eur",
      returnUrl,
    } = req.body;

    if (!paymentMethodId || !customerId || !amount) {
      return res.status(400).json({
        message: "paymentMethodId, customerId et amount sont requis",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: paymentMethodId,
      customer: customerId,
      amount,
      currency,
      confirm: true,
      return_url: returnUrl,
    });

    res.status(200).json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Erreur création PaymentIntent :", error);

    res.status(500).json({
      message: "Erreur lors de la création du paiement",
    });
  }
};
