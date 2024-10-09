const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true 
  },  // Reference to the user who created the discussion
  learningMaterialId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "LearningMaterial", 
    required: true 
  },  // Reference to the learning material associated with the discussion
  content: { 
    type: String, 
    required: true 
  },  // Content of the discussion
  // List of replies within a discussion
  createdAt: { 
    type: Date, 
    default: Date.now 
  }  // Timestamp for when the discussion was created
});

module.exports = mongoose.model("Discussion", discussionSchema);
   