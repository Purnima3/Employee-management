const express = require('express');
const { forgotPassword, verifyOtp } = require('../controller/ForgetPassword');
const {sendOtpEmail} = require('../controller/send-email')

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/send-otp',sendOtpEmail);

module.exports = router;
