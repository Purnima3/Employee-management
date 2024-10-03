const Quiz = require('../models/Quiz');

const createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body); // req.body should contain the title, questions, and learningMaterialId
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
};
