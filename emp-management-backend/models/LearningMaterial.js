const mongoose = require("mongoose");

const learningMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number,
  contentUrl: String,
  department: { type: String, required: true },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }], // Array of module IDs
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }, // Reference to the quiz
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LearningMaterial", learningMaterialSchema);
