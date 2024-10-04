const express = require('express');
const {sendEmail}= require('../controller/send-email');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send-email',sendEmail,authMiddleware)

module.exports = router;