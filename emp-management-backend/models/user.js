const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "employee"] }
});
console.log("models called")
module.exports = mongoose.model("user", userSchema);
