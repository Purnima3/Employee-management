const express = require('express');
const router = express.Router();
const learningMaterialController = require('../controller/learningMaterialController');

const authMiddleware = require('../middleware/authMiddleware');


router.post('/create-material', learningMaterialController.createLearningMaterial,authMiddleware);


router.get('/get-material', learningMaterialController.getLearningMaterials,authMiddleware);
router.put('/update-material/:id', learningMaterialController.updateLearningMaterial,authMiddleware);
router.delete('/delete-learning-material/:id', learningMaterialController.deleteLearningMaterial,authMiddleware);
router.get('/departments', learningMaterialController.getDistinctDepartments,authMiddleware);
router.get('/get/:department',learningMaterialController.getMaterialsByDepartment, authMiddleware);
router.get('/get-materials-emp',learningMaterialController.getMaterialForEmployee,authMiddleware)
module.exports = router;
