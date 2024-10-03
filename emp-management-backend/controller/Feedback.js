//const express = require('express');
const Feedback = require('../models/Feedback'); // Adjust the path as necessary
//const router = express.Router();

// DELETE Feedback Route

const deleteFeedback = async (req, res) => {
    try {
        const feedbackId  = req.params.id;
        const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
    
        if (!deletedFeedback) {
          return res.status(404).json({ message: 'Feedback not found' });
        }
    
        res.status(200).json({ message: 'Feedback deleted successfully', deletedFeedback });
      } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

const createFeedback = async (req, res) => {
    const feedback = new Feedback({
              userId: req.body.userId,
              materialId: req.body.materialId,
              feedback: req.body.feedback,
            });
          
            try {
              const newFeedback = await feedback.save();
              res.status(201).json(newFeedback);
            } catch (err) {
              res.status(400).json({ message: err.message });
            }

}

const feedbackByMaterialId = async (req, res) => {
    try {
      
      const feedbacks = await Feedback.find({ learningMaterialId: req.params.materialId }) 
        .populate('userId', 'firstName lastName'); 
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // const getAllFeedback = async (req, res) => {
  //   try {
  //     const feedbacks = await Feedback.find()
  //       .populate('userId', 'firstName lastName')
  //       .populate('learningMaterialId', 'title description');
  //     if (!feedbacks) {
  //       return res.status(404).json({ message: 'No feedback found' });
  //     }
  //     res.json(feedbacks);
  //   } catch (err) {
  //     if (err.name === 'CastError') {
  //       // If the error is a CastError, it's usually due to invalid ObjectId or missing reference
  //       return res.status(400).json({ message: 'Invalid reference in feedback data' });
  //     }
  //     res.status(500).json({ message: `Server error: ${err.message}` });
  //   }
  // };
  const getAllFeedback = async (req, res) => {
    try {
      const feedbacks = await Feedback.find(); // Remove populate for testing
      res.json(feedbacks);
    } catch (err) {
      console.error("Error details: ", err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
  
  
// router.post('/', async (req, res) => {
//     const feedback = new Feedback({
//       userId: req.body.userId,
//       materialId: req.body.materialId,
//       feedback: req.body.feedback,
//     });
  
//     try {
//       const newFeedback = await feedback.save();
//       res.status(201).json(newFeedback);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });

// router.delete('/delete-feedback/:id', async (req, res) => {
//   try {
//     const feedbackId = req.params.id;
//     const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

//     if (!deletedFeedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }

//     res.status(200).json({ message: 'Feedback deleted successfully', deletedFeedback });
//   } catch (error) {
//     console.error('Error deleting feedback:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;

module.exports = {deleteFeedback,createFeedback,feedbackByMaterialId,getAllFeedback}