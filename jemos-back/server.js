const express = require("express");
const port = process.env.PORT || 5000;
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Configuration CORS pour autoriser les paiements Stripe
app.use(cors());

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes pour les différents modèles
app.use("/", require("./routes/upload.routes"));
app.use("/", require("./routes/uploadOnServer.routes"));
app.use("/", require("./routes/poi.routes"));
app.use("/", require("./routes/project.routes"));
app.use("/", require("./routes/user.routes"));
app.use("/", require("./routes/billingAddress.routes"));
app.use("/", require("./routes/email.routes"));
app.use("/", require("./routes/card.routes"));
app.use("/", require("./routes/invoices.routes"));
app.use("/", require("./routes/quizzAnswers.routes"));
app.use("/uploads", express.static("uploads"));
app.use("/uploadFilesOnServer", express.static("uploadFilesOnServer"));

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Le serveur HTTP est lancé sur http://0.0.0.0:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
