const express = require("express");
const {createUser,fetchUsers} = require("../controller/users")

const router = express.Router()
console.log("routes called")
router.post('/create-user',createUser)
router.get('/fetch-user',fetchUsers)

module.exports = router;