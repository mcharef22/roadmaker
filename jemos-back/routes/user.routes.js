const express = require("express");
const { checkAuth } = require("../middleware/auth.middleware");
const {
  setUsers,
  getUsers,
  editUser,
  deleteUser,
  addProjectToUser,
  getUserByEmail,
  getUser,
  updateStripeCustomer,
  createStripeCustomer,
  loginUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:id", checkAuth, getUser);
router.post("/user", setUsers);
router.put("/user/:id", editUser);
router.delete("/user/:id", deleteUser);
router.patch("/user/projects/:id", addProjectToUser);
router.get("/user", getUserByEmail);
router.put("/user/updateStripeCustomer/:userId", updateStripeCustomer);
router.post("/user/stripe-customer", createStripeCustomer);
router.post("/login", loginUser);

module.exports = router;
