// routes/dashboardRoutes.js
const express = require('express');
const {
  getTopEmployees,
  getDepartmentScores,
  getTopFeedbackLearningMaterial,
} = require('../controller/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/top-employees', getTopEmployees,authMiddleware); // Fetch top 10 employees by scores
router.get('/department-scores', getDepartmentScores,authMiddleware); // Fetch average department scores
router.get('/top-feedback-material', getTopFeedbackLearningMaterial,authMiddleware); // Get learning material with most feedback

module.exports = router;
