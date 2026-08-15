const { default: mongoose } = require("mongoose");

const quizzAnswersSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answers: {
    type: Array,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  user_name: {
    type: String,
    required: false,
  },
});

const QuizzAnswers = mongoose.model("quizzAnswers", quizzAnswersSchema);
module.exports = QuizzAnswers;
