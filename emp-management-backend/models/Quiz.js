const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuizQuestion" }], // Array of quiz question IDs
  learningMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningMaterial", required: true }, // Reference to the learning material
});

module.exports = mongoose.model("Quiz", quizSchema);
