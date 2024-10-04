const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateToken } = require("../utils/authUtils");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.status(200).json({ user: { id: user._id, email: user.email ,role:user.role}, token });
  } catch (error) {
    console.error("Login error:", error); 
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}



module.exports = { login };