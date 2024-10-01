const mongoose = require("mongoose");

const learningMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number, 
  contentUrl: String, 
  department: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LearningMaterial", learningMaterialSchema);
