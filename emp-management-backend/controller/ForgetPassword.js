const User = require('../models/user'); // Import your User model
const bcrypt = require('bcrypt');

const otp = Math.floor(100000 + Math.random() * 900000).toString();
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'OTP sent to your email!' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};


const verifyOtp = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; 
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Failed to update password' });
  }
}; 

module.exports = {
  forgotPassword,
  verifyOtp,
};
