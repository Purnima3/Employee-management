const express = require("express");
const router = express.Router();
const { createModule } = require("../controller/module");

// Route to create a new module
router.post("/create-module", createModule);

module.exports = router;
