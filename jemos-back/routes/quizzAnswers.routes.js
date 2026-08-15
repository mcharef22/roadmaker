const express = require("express");
const { setQuizzAnswers } = require("../controllers/quizzAnswers.controller");
const router = express.Router();

router.post("/quizzAnswers", setQuizzAnswers);

module.exports = router;
