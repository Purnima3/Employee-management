const Engagement = require('../models/Engagement')

exports.getEngagementByuserId = async(req,res) => {
    try {
              const engagements = await Engagement.find({ userId: req.params.userId })
                .populate("learningMaterialId", "title")
                .exec();
              res.json(engagements);
            } catch (err) {
              res.status(500).json({ message: err.message });
            }
}


exports.updateEngagementData = async(req,res) =>{
  try {
    console.log(req.body)
    const { userId, learningMaterialId, moduleId, quizScore, completed } = req.body;
    const engagement = await Engagement.findOne({ userId, learningMaterialId });
      
    console.log(engagement)
    if (engagement) {
      // Update engagement for the module completion
      if (moduleId) {
        const moduleIndex = engagement.moduleCompletion.findIndex(m => m.moduleId.toString() === moduleId);
        if (moduleIndex >= 0) {
          engagement.moduleCompletion[moduleIndex].completed = completed;
        } else {
          engagement.moduleCompletion.push({ moduleId, completed });
        }
      }
      // Update quiz score if provided
      if (quizScore !== undefined) {
        engagement.quizScore = quizScore;
      }

      await engagement.save();
      res.json({ message: 'Engagement updated successfully', engagement });
    } else {
      res.status(404).json({ message: 'Engagement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update engagement' });
  }
}

  