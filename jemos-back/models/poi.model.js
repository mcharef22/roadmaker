const mongoose = require("mongoose");

const poiSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    position: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    distanceToMarker: {
      type: String,
      required: false,
    },
    stopover: {
      type: Boolean,
      required: false,
    },
    subType: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: Array,
      required: false,
    },
    iconImage: {
      type: String,
      required: false,
    },
    video: {
      type: Array,
      required: false,
    },
    audio: {
      type: Array,
      required: false,
    },
    checkAudio: {
      type: Boolean,
      required: false,
    },
    resourceArray: {
      type: Array,
      required: false,
    },
    mainResource: {
      type: String,
      required: false,
    },
    checkAcces: {
      type: String,
      required: false,
    },
    imageName: {
      type: Array,
      required: false,
    },
    videoName: {
      type: Array,
      required: false,
    },
    audioName: {
      type: Array,
      required: false,
    },
    iconName: {
      type: String,
      required: false,
    },
    iconNameWithoutBorder: {
      type: String,
      required: false,
    },
    markerToDownload: {
      type: String,
      required: false,
    },
    Project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
    dateOfCreation: {
      type: Number,
      default: Date.now,
    },
    triggerType: {
      type: String,
      required: false,
    },
    triggerDistance: {
      type: Number,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    openQuestionArray: [
      {
        question: {
          type: String,
          required: false,
        },
        answer: {
          type: String,
          required: false,
        },
        successMessage: {
          type: String,
          required: false,
        },
        errorMessage: {
          type: String,
          required: false,
        },
      },
    ],
    qcmArray: [
      {
        question: {
          type: String,
          required: false,
        },
        answersArray: {
          type: Array,
          required: false,
        },
        correctAnswers: {
          type: Array,
          required: false,
        },
        successMessage: {
          type: String,
          required: false,
        },
        errorMessage: {
          type: String,
          required: false,
        },
      },
    ],
    qcmImageArray: [
      {
        question: {
          type: String,
          required: false,
        },
        answersTitleArray: {
          type: Array,
          required: false,
        },
        answersArray: {
          type: Array,
          required: false,
        },
        correctAnswers: {
          type: Array,
          required: false,
        },
        successMessage: {
          type: String,
          required: false,
        },
        errorMessage: {
          type: String,
          required: false,
        },
        imageName: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: { dateOfCreation: "dateOfCreation" },
  }
);

module.exports = mongoose.model("poi", poiSchema);
