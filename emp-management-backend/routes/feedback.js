// routes/feedback.js
const express = require('express');
const {createFeedback,getAllFeedback,feedbackByMaterialId,deleteFeedback} = require('../controller/Feedback');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router()

router.post("/create-feedback",createFeedback,authMiddleware)
router.get("/get-all-feedback",getAllFeedback,authMiddleware)
router.get('/:materialId',feedbackByMaterialId,authMiddleware)
router.delete('/delete-feedback/:id',deleteFeedback,authMiddleware)


module.exports = router;
