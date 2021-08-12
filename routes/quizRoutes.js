const express = require('express');
const quizController = require('../controllers/quizController');
const router = express.Router();

router.get('/quiz', quizController.getQuiz);

module.exports = router;
