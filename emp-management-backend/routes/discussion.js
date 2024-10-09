const express = require('express');
const DiscussionController = require('../controller/Discussion');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create',  DiscussionController.createDiscussion,authMiddleware);
router.get('/:materialId',  DiscussionController.getDiscussionsByMaterial,authMiddleware);

module.exports = router;
