const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: false,
  },
  colorProject: {
    type: String,
    required: false,
  },

  //direction_result: {
  //  type: String,
  //  required: false,
  //},
  polyline_result: {
    type: String,
    required: false,
  },

  trkseg: [
    {
      lat: Number,
      lng: Number,
    },
  ],

  customNavigationPoints: {
    type: String,
    required: false,
  },

  customIndicationsEdited: {
    type: Boolean,
    required: false,
    default: false,
  },

  originPOI: {
    id: {
      type: Number,
      required: false,
    },
    lat: {
      type: Number,
      required: false,
    },
    lng: {
      type: Number,
      required: false,
    },
  },
  destinationPOI: {
    id: {
      type: Number,
      required: false,
    },
    lat: {
      type: Number,
      required: false,
    },
    lng: {
      type: Number,
      required: false,
    },
  },

  destinationSameAsOrigin: {
    type: Boolean,
    required: false,
  },

  POIs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "poi",
      required: false,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  dateOfCreation: {
    type: Number,
    default: Date.now,
  },
  dateOfModification: {
    type: Date,
    default: Date.now,
  },
  kmlFile: {
    type: String,
    required: false,
  },
  urlKmlToFetsh: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("project", projectSchema);
