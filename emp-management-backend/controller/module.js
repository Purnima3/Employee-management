const Module = require('../models/module');

const createModule = async (req, res) => {
  try {
    const newModule = new Module(req.body); // req.body should contain title, contentUrl, and learningMaterialId
    const savedModule = await newModule.save();
    res.status(201).json(savedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createModule,
};
