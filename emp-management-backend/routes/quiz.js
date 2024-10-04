const express = require('express');
const router = express.Router();
const quizController = require('../controller/Quiz');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-quiz', quizController.createQuiz,authMiddleware);
router.get('/get-quizzes', quizController.getQuizzes,authMiddleware);
router.get('/get-quiz/:learningMaterialId', quizController.getQuizByLearningMaterial,authMiddleware);

module.exports = router;
