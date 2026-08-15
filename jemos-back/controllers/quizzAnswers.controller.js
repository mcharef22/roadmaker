const QuizzAnswers = require("../models/quizzAnswers.model");

module.exports.setQuizzAnswers = async (req, res) => {
  const quizzAnswers = await QuizzAnswers.create({
    title: req.body.stand,
    question: req.body.question,
    answers: req.body.answers,
    SubmissionDate: req.body.SubmissionDate,
    user: req.body.user,
    user_name: req.body.user_name,
  });
  res.status(200).json(quizzAnswers);
};
