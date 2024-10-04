const User = require('../models/user'); 
const bcrypt = require('bcrypt');

const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const router = express.Router();

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


const sendOtp = async(req,res) =>{
    const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error sending OTP' });
  }
}

const varifyOtp = async(req,res) =>{
    const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }

    user.password = newPassword; 
    user.otp = undefined; 
    user.otpExpiration = undefined; 
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error resetting password' });
  }
}

const fetchUsers = async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json(users); 
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createUser = async (req, res) => {
    const { firstName, lastName, email, role, department, password } = req.body;

    try {
     // const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        email,
        role,
        department: role === 'employee' ? department : null, 
        password: password,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
};
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserDetails = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId).select('firstName lastName'); 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ firstName: user.firstName, lastName: user.lastName });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {
    fetchUsers,
    createUser,
    deleteUser,
    getUserDetails,
    varifyOtp,
    sendOtp,
};
