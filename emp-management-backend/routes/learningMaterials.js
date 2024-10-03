const express = require('express');
const router = express.Router();
const LearningMaterial = require('../models/LearningMaterial');

// Get all learning materials
//http://localhost:3001/learning-materials/get-material
router.get('/get-material', async (req, res) => {
  try {
    const materials = await LearningMaterial.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new learning material
router.post('/create-material', async (req, res) => {
  const { title, description, duration, contentUrl } = req.body;

  const newLearningMaterial = new LearningMaterial({
    title,
    description,
    duration,
    contentUrl,
  });

  ///learning-materials/delete-learning-material/${selectedMaterial._id}
  try {
    const savedMaterial = await newLearningMaterial.save();
    res.status(201).json(savedMaterial); // Respond with the created material
  } catch (err) {
    res.status(400).json({ message: err.message }); // Respond with an error message
  }
});

router.delete('/delete-learning-material/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await LearningMaterial.findByIdAndDelete(id);
    
    if (!deletedMaterial) {
      return res.status(404).json({ message: 'Learning material not found' });
    }

    res.status(200).json({ message: 'Learning material deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
