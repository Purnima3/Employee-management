// routes/dashboardRoutes.js
const express = require('express');
const {
  getTopEmployees,
  getDepartmentScores,
  getTopFeedbackLearningMaterial,
} = require('../controller/dashboardController');

const router = express.Router();

router.get('/top-employees', getTopEmployees); // Fetch top 10 employees by scores
router.get('/department-scores', getDepartmentScores); // Fetch average department scores
router.get('/top-feedback-material', getTopFeedbackLearningMaterial); // Get learning material with most feedback

module.exports = router;
