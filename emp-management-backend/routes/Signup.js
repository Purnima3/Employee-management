const express = require("express")
const{ signupUser }= require("../controller/SignUp")

const router = express.Router()
console.log("routes called")
router.post('/register',signupUser)

module.exports = router;