const Discussion = require('../models/Discussion'); // Assuming you create a Discussion model
const User = require('../models/user')
exports.createDiscussion = async (req, res) => {

  try {
     console.log(req.body)
    const newDiscussion = new Discussion({
      userId: req.body.userId, // Assuming user info is attached to req by auth middleware
      learningMaterialId: req.body.materialId,
      content: req.body.discussion,
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
    // Log the materialId from the request parameters
    console.log(req.params.materialId);

    // Find all discussions related to the provided materialId
    const discussions = await Discussion.find({ learningMaterialId: req.params.materialId });

    // Use Promise.all to concurrently fetch user emails for each discussion
    const discussionsWithUserEmails = await Promise.all(
      discussions.map(async (discussion) => {
        // Find the user by the userId present in the discussion
        const user = await User.findById(discussion.userId);

        // Return the discussion object along with the userEmail
        return {
          ...discussion.toObject(), // Ensure discussion is converted to plain object
          userEmail: user ? user.email : 'Unknown', // Include userEmail if found, else 'Unknown'
        };
      })
    );

    // Respond with the discussions that include user emails
    res.json(discussionsWithUserEmails);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
