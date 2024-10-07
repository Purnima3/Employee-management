const Engagement = require('../models/Engagement')
const User = require("../models/user");
const LearningMaterial = require("../models/LearningMaterial");
const Module = require("../models/module");
exports.getEngagementByuserId = async (req, res) => {
  try {
    const engagements = await Engagement.find({ userId: req.params.userId })
      .populate("learningMaterialId", "title")
      .exec();
    res.json(engagements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


exports.updateEngagementData = async (req, res) => {
  try {
    const { userId, learningMaterialId, moduleId, completed, quizScore } = req.body;

    // Find the engagement document based on user ID and learning material ID
    const engagement = await Engagement.findOne({
      userId: userId,
      'learningMaterialCompletion.learningMaterialId': learningMaterialId,
    });

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

      // Update engagement for quiz score and mark learning material as completed
      if (quizScore !== undefined) {
        engagement.quizScore = quizScore;

        // Mark the learning material as completed if the quiz is submitted
        const learningMaterialIndex = engagement.learningMaterialCompletion.findIndex(
          lm => lm.learningMaterialId.toString() === learningMaterialId
        );
        if (learningMaterialIndex >= 0) {
          engagement.learningMaterialCompletion[learningMaterialIndex].completed = true;
        } else {
          engagement.learningMaterialCompletion.push({ learningMaterialId, completed: true });
        }
      }

      // Save the updated engagement entry to the database
      console.log(engagement)
      await engagement.save();
      return res.json({ message: 'Engagement updated successfully', engagement });
    } else {
      return res.status(404).json({ message: 'Engagement not found' });
    }
  } catch (error) {
    console.error('Error updating engagement:', error);
    return res.status(500).json({ error: 'Failed to update engagement' });
  }
};



exports.createEngagement = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const { userId, learningMaterialId } = req.body;

    if (!userId || !learningMaterialId) {
      return res.status(400).json({ message: "User ID and Learning Material ID are required." });
    }

    const learningMaterial = await LearningMaterial.findById(learningMaterialId).populate('modules');
    if (!learningMaterial) {
      return res.status(404).json({ message: "Learning material not found." });
    }

    const moduleCompletion = learningMaterial.modules.map((module) => ({
      moduleId: module._id,
      completed: false,
    }));

    const engagement = new Engagement({
      userId,
      learningMaterialCompletion: [
        { learningMaterialId, completed: false },
      ],
      moduleCompletion: moduleCompletion,
      quizScore: 0,
    });

    
    await engagement.save();

    return res.status(201).json({ message: "Engagement created successfully!", engagement });
  } catch (error) {
    console.error("Error creating engagement:", error);
    return res.status(500).json({ message: error.message || "Internal server error." });
  }
};
