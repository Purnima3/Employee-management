const Discussion = require('../models/Discussion'); // Assuming you create a Discussion model

exports.createDiscussion = async (req, res) => {
  try {
    const newDiscussion = new Discussion({
      userId: req.user.id, // Assuming user info is attached to req by auth middleware
      materialId: req.body.materialId,
      discussion: req.body.discussion,
    });
    await newDiscussion.save();
    res.status(201).json(newDiscussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getDiscussionsByMaterial = async (req, res) => {
  try {
    const discussions = await Discussion.find({ materialId: req.params.materialId })
      .populate('userId', 'firstName lastName');
    res.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
