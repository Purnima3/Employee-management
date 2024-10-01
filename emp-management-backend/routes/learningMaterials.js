const express = require('express');
const router = express.Router();
const LearningMaterial = require('../models/LearningMaterial');

// Get all learning materials
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

  try {
    const savedMaterial = await newLearningMaterial.save();
    res.status(201).json(savedMaterial); // Respond with the created material
  } catch (err) {
    res.status(400).json({ message: err.message }); // Respond with an error message
  }
});

module.exports = router;
