const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  contentUrl: String,
  learningMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningMaterial", required: true }, // Reference to the learning material
});

module.exports = mongoose.model("Module", moduleSchema);
