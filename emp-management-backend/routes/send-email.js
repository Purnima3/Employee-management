const express = require('express');
const {sendEmail}= require('../controller/send-email');

const router = express.Router();

router.post('/send-email',sendEmail)

module.exports = router;