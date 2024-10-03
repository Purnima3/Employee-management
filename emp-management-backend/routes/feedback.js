// routes/feedback.js
const express = require('express');
const {createFeedback,getAllFeedback,feedbackByMaterialId,deleteFeedback} = require('../controller/Feedback');

const router = express.Router()

router.post("/create-feedback",createFeedback)
router.get("/get-all-feedback",getAllFeedback)
router.get('/:materialId',feedbackByMaterialId)
router.delete('/delete-feedback/:id',deleteFeedback)


module.exports = router;
// Post feedback
// router.post('/', async (req, res) => {
//   const feedback = new Feedback({
//     userId: req.body.userId,
//     materialId: req.body.materialId,
//     feedback: req.body.feedback,
//   });

//   try {
//     const newFeedback = await feedback.save();
//     res.status(201).json(newFeedback);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Get feedback for a specific material
// router.get('/:materialId', async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find({ materialId: req.params.materialId }).populate('userId', 'firstName lastName');
//     res.json(feedbacks);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get('/all_feedback', async (req, res) => {
//     try {
//         // Fetch all feedback and populate user and learning material references
//         const feedbacks = await Feedback.find()
//             .populate('userId', 'firstName lastName')
//             .populate('learningMaterialId', 'title description'); // Populate learning material details if needed
//         res.json(feedbacks);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

