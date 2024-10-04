const Module = require('../models/module');

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


