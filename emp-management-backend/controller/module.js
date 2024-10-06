const Module = require('../models/module');
const Quiz = require('../models/Quiz')

exports.createModule = async (req, res) => {
  try {
    const { title, description, content, learningMaterialId } = req.body;
    const newModule = new Module({ title, description, content, learningMaterialId });
    await newModule.save();
    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating module', error });
  }
};

exports.getModulesByLearningMaterial = async (req, res) => {
  try {
    const { learningMaterialId } = req.params;
    const modules = await Module.find({ learningMaterialId });
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules', error });
  }
};

exports.getModulesAndQuizEmployees = async(req,res) =>{
  console.log("heyyy i am called")

  try {

    const modules = await Module.find({ learningMaterialId: req.params.learningMaterialId });
    const quiz = await Quiz.findOne({ learningMaterialId: req.params.learningMaterialId });
    res.json({ modules, quiz });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch modules or quiz' });
  }
}


