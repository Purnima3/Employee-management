const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  learningMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningMaterial", required: true }, 
  timeSpent: { type: Number, default: 0 }, 
  quizScore: { type: Number, default: 0 }, 
  participationCount: { type: Number, default: 0 }, 
  lastAccessed: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Engagement", engagementSchema);
