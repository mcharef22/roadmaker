const UserModel = require("../models/user.model");
const ProjectModel = require("../models/project.model");
const BindingAddressModel = require("../models/billingAddress.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bcrypt = require("bcryptjs");

module.exports.getUsers = async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
};

/**
 * requete asynchrone pour récupérer un utilisateur.
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.getUser = async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    res
      .status(404)
      .send({ message: "user not found with id " + req.params.id });
  }
  res.status(200).json(user);
};

/**
 * requete asynchrone pour mettre en place les utilisateurs
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.setUsers = async (req, res) => {
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    admin: req.body.admin,
    projects: req.body.projects,
    confirmed: req.body.confirmed,
    pack: req.body.pack,
    dateOfCreation: req.body.dateOfCreation,
    stripeCustomerId: req.body.stripeCustomerId,
    globalScore: req.body.globalScore || 0,
  });
  res.status(200).json(user);
};

/**
 * requete asynchrone pour éditer un utilisateur
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.editUser = async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .send({ message: "User not found with id " + req.params.id });
  }

  // Check if a new password is provided
  if (req.body.password) {
    req.body.password = user.hashPassword(req.body.password);
  }

  // Update the user in the database
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res.status(200).json(updatedUser);
};

/**
 * requete asynchrone pour supprimer un utilisateur
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.deleteUser = async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    res
      .status(404)
      .send({ message: "User not found with id " + req.params.id });
  }
  await UserModel.deleteOne({ _id: req.params.id });
  await ProjectModel.deleteMany({ user: req.params.id });

  res.status(200).json({
    message:
      "User " + user.id + " and associated projects deleted successfully!",
  });
};

// module.exports.getProjectsByUser = async (req, res) => {
//     const userId = req.params.id;
//     ProjectModel.find({ user: userId }).populate("user").exec((err, projects) => {
//       if (err) {
//         res.status(400).json({ message: err });
//         return;
//       }
//       res.status(200).json(projects);
//     });
//   };

/**
 * requete asynchrone pour ajouter un projet à un utilisateur
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.addProjectToUser = async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    res
      .status(404)
      .send({ message: "User not found with id " + req.params.id });
  }

  user.projects.push(req.body);
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
};

/**
 * requete asynchrone pour récupérer un utilisateur par son email
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 * @returns {string} - retourne une reponse du serveur
 */
module.exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.updateStripeCustomer = async (req, res) => {
  try {
    const { stripeCustomerId } = req.body;

    // Mettre à jour le champ stripeCustomerId dans la base de données
    await UserModel.findByIdAndUpdate(req.params.userId, {
      stripeCustomerId: stripeCustomerId,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating Stripe Customer ID:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports.createStripeCustomer = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const customer = await stripe.customers.create({
      email,
    });

    res.status(201).json({
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Erreur création customer Stripe :", error);
    res.status(500).json({
      message: "Erreur lors de la création du customer Stripe",
    });
  }
};
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Identifiants invalides",
      });
    }

    const passwordValid = bcrypt.compareSync(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Identifiants invalides",
      });
    }

    const userObject = user.toObject();
    delete userObject.password;

    return res.status(200).json(userObject);
  } catch (error) {
    console.error("Erreur connexion utilisateur :", error);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};
