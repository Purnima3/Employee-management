
const Feedback = require('../models/Feedback'); 

exports.deleteFeedback = async (req, res) => {
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

exports.createFeedback = async (req, res) => {
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

exports.feedbackByMaterialId = async (req, res) => {
    try {
      
      const feedbacks = await Feedback.find({ learningMaterialId: req.params.materialId }) 
        .populate('userId', 'firstName lastName'); 
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.getAllFeedback = async (req, res) => {
    try {
      const feedbacks = await Feedback.find(); 
      res.json(feedbacks);
    } catch (err) {
      console.error("Error details: ", err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
 
  exports.setFeedback = async(req,res) =>
  {
    try {
          const { userId, learningMaterialId, feedback, rating } = req.body;
          const newFeedback = new Feedback({ userId, learningMaterialId, feedback, rating });
          await newFeedback.save();
          res.status(201).json({ message: 'Feedback submitted successfully' });
        } catch (error) {
          console.error('Error submitting feedback:', error);
          res.status(500).json({ message: 'Error submitting feedback' });
        }
  }
  
  // Create new feedback
  // router.post('/create', async (req, res) => {
  //   try {
  //     const { userId, learningMaterialId, feedback, rating } = req.body;
  //     const newFeedback = new Feedback({ userId, learningMaterialId, feedback, rating });
  //     await newFeedback.save();
  //     res.status(201).json({ message: 'Feedback submitted successfully' });
  //   } catch (error) {
  //     console.error('Error submitting feedback:', error);
  //     res.status(500).json({ message: 'Error submitting feedback' });
  //   }
  // });
  
