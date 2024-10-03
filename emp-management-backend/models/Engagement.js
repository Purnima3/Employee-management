const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  learningMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningMaterial", required: true },
  timeSpent: { type: Number, default: 0 },
  quizScore: { type: Number, default: 0 },
  moduleCompletion: [{ 
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module" }, // Reference to the module
    completed: { type: Boolean, default: false }, // Completion status
  }],
});

module.exports = mongoose.model("Engagement", engagementSchema);
