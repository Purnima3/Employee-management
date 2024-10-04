
const express = require("express");
const router = express.Router();
const EngagementController = require("../controller/engagement");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:userId',EngagementController.getEngagementByuserId,authMiddleware)
router.post('',EngagementController.updateEngagementData,authMiddleware)

module.exports = router;
