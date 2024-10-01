// routes/engagement.js
const express = require("express");
const router = express.Router();
const Engagement = require("../models/Engagement");

// Get engagement data for a user
router.get("/:userId", async (req, res) => {
  try {
    const engagements = await Engagement.find({ userId: req.params.userId })
      .populate("learningMaterialId", "title")
      .exec();
    res.json(engagements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post or update engagement data
router.post("/", async (req, res) => {
  const { userId, learningMaterialId, timeSpent, participationCount } = req.body;

  try {
    let engagement = await Engagement.findOne({ userId, learningMaterialId });

    if (engagement) {
      // Update existing engagement
      engagement.timeSpent += timeSpent; // Update time spent
      engagement.participationCount += participationCount; // Update participation count
      engagement.lastAccessed = Date.now(); // Update last accessed time
    } else {
      // Create new engagement
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
});

module.exports = router;
