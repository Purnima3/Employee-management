const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  learningMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningMaterial", required: true }, 
  feedback: { type: String, required: true }, 
  rating: { type: Number, min: 1, max: 5, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
