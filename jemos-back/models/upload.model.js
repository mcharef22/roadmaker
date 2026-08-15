const mongoose = require("mongoose");

const gpxSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: false,
  },
  chemin: {
    type: String,
    required: true,
  },
});
const kmlSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: false,
  },
  chemin: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});
module.exports = mongoose.model("KML", kmlSchema);
module.exports = mongoose.model("GPX", gpxSchema);
