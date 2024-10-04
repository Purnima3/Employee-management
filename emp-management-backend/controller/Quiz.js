const Quiz = require('../models/Quiz');

exports.createQuiz = async (req, res) => {
  try {
    const { title, questions, learningMaterialId } = req.body;
    const newQuiz = new Quiz({ title, questions, learningMaterialId });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz', error });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('learningMaterialId');
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error });
  }
};

exports.getQuizByLearningMaterial = async (req, res) => {
  try {
    const { learningMaterialId } = req.params;
    const quiz = await Quiz.findOne({ learningMaterialId });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz for learning material', error });
  }
};

