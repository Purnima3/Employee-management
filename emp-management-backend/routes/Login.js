const express = require("express");
const {login} = require("../controller/SignIn")

const router = express.Router()

router.post("/login",login)

module.exports = router;
