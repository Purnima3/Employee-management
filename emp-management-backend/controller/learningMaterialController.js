const LearningMaterial = require('../models/LearningMaterial');

exports.createLearningMaterial = async (req, res) => {
  try {
    const { title, description, department } = req.body;
    const newMaterial = new LearningMaterial({ title, description, department });
    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(500).json({ message: 'Error creating learning material', error });
  }
};

exports.getLearningMaterials = async (req, res) => {
  try {
    const materials = await LearningMaterial.find().populate('modules').populate('quiz');
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learning materials', error });
  }
};

exports.updateLearningMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { modules, quiz } = req.body;
    const updatedMaterial = await LearningMaterial.findByIdAndUpdate(
      id,
      { modules, quiz },
      { new: true }
    );
    res.status(200).json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ message: 'Error updating learning material', error });
  }
};

exports.deleteLearningMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await LearningMaterial.findByIdAndDelete(id);
    res.status(200).json({ message: 'Learning material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting learning material', error });
  }
};

exports.getDistinctDepartments = async (req, res) => {
    try {
      const departments = await LearningMaterial.distinct('department');
      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching departments', error });
    }
  };
  
exports.getMaterialForEmployee=async(req,res)=>{
  try {
    const learningMaterials = await LearningMaterial.find().populate('modules quiz');
    res.json(learningMaterials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch learning materials' });
  }
}

exports.getMaterialsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const materials = await LearningMaterial.find({ department }); // Adjust query as needed
    res.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};