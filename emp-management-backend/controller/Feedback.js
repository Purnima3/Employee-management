
const Feedback = require('../models/Feedback'); 


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

  const getAllFeedback = async (req, res) => {
    try {
      const feedbacks = await Feedback.find(); 
      res.json(feedbacks);
    } catch (err) {
      console.error("Error details: ", err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
 

module.exports = {deleteFeedback,createFeedback,feedbackByMaterialId,getAllFeedback}