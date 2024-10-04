const engagement = require('../models/Engagement')

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
    const { userId, learningMaterialId, timeSpent, participationCount } = req.body;
  
    try {
      let engagement = await Engagement.findOne({ userId, learningMaterialId });
  
      if (engagement) {
        engagement.timeSpent += timeSpent; 
        engagement.participationCount += participationCount; 
        engagement.lastAccessed = Date.now(); 
      } else {
        engagement = new Engagement({
          userId,
          learningMaterialId,
          timeSpent,
          participationCount,
        });
      }
  
      await engagement.save();
      res.status(200).json(engagement);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
}

  