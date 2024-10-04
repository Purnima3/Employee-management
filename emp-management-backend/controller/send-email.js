const nodemailer = require('nodemailer');
require('dotenv').config();

// Set up the transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

// Temporary storage for OTPs
let storedOtps = {};

// Send email controller for new user
const sendEmail = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'New User Created',
    text: `A new user has been created with the following credentials:\n\nEmail: ${email}\nPassword: ${password}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return res.status(200).json({ message: 'Email sent successfully!' }); // Respond to the client
  } catch (error) {
    console.error('Error sending email: ', error);
    return res.status(500).json({ message: 'Error sending email.' }); // Handle error response
  }
};

// Generate a random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Send OTP email controller
const sendOtpEmail = async (req, res) => {
  const { email } = req.body; // Extract email from request body

  // Generate OTP
  const otp = generateOtp();
  storedOtps[email] = otp; // Store OTP associated with email

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    
    return res.status(200).json({ message: 'OTP sent successfully!' }); 
  } catch (error) {
    console.error('Error sending OTP email: ', error);
    return res.status(500).json({ message: 'Error sending OTP email.' });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (storedOtps[email] && storedOtps[email] === otp) {

    delete storedOtps[email]; 

    return res.status(200).json({ message: 'Password updated successfully!' });
  } else {
    return res.status(400).json({ message: 'Invalid OTP.' });
  }
};

module.exports = { sendEmail, sendOtpEmail, verifyOtp };
