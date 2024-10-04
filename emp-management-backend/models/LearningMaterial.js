const mongoose = require("mongoose");

const learningMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number,
  contentUrl: String,
  department: { type: String, required: true },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }], 
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LearningMaterial", learningMaterialSchema);
