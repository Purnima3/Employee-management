// routes/feedback.js
const express = require('express');
const FeedbackController = require('../controller/Feedback');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router()

router.post("/create-feedback",FeedbackController.setFeedback,authMiddleware)
router.get("/get-all-feedback",FeedbackController.getAllFeedback,authMiddleware)
router.get('/:materialId',FeedbackController.feedbackByMaterialId,authMiddleware)
router.delete('/delete-feedback/:id',FeedbackController.deleteFeedback,authMiddleware)


module.exports = router;
