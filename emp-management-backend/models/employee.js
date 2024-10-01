const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, 
  department: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Employee", empSchema);
