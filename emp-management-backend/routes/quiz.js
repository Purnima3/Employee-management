const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

router.post('/create-quiz',Quiz)

module.exports = router;