const express = require("express");
const {createUser,fetchUsers,deleteUser,getUserDetails,varifyOtp,
    sendOtp,
    } = require("../controller/users")
const {sendEmail} = require('../controller/send-email')

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router()
console.log("routes called")
router.post('/create-user',createUser,authMiddleware)
router.get('/fetch-user',fetchUsers,authMiddleware)
router.delete('/delete-user/:id',deleteUser,authMiddleware)
router.post('/send-email',sendEmail,authMiddleware)
router.get('/feedback/:userId', getUserDetails,authMiddleware);
router.post('/send-otp',sendOtp,authMiddleware)
router.post('/verify-otp',varifyOtp,authMiddleware)

module.exports = router;