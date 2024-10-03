const express = require("express");
const {createUser,fetchUsers,deleteUser,getUserDetails} = require("../controller/users")
const {sendEmail} = require('../controller/send-email')

const router = express.Router()
console.log("routes called")
router.post('/create-user',createUser)
router.get('/fetch-user',fetchUsers)
router.delete('/delete-user/:id',deleteUser)
router.post('/send-email',sendEmail)
router.get('/feedback/:userId', getUserDetails);

module.exports = router;