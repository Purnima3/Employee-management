const express = require("express");
const router = express.Router();
const moduleController = require('../controller/module');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-module', moduleController.createModule,authMiddleware);
router.get('/get-modules/:learningMaterialId', moduleController.getModulesByLearningMaterial,authMiddleware);


module.exports = router;
