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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.otp = otp;
    user.otpExpiry = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email.' });
      }
      res.status(200).json({ message: 'OTP sent to your email!' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Verify OTP and update password
exports.verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, otp });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.password = newPassword; // Update password
    user.otp = undefined; // Clear OTP
    user.otpExpiry = undefined; // Clear expiry
    await user.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { login };
