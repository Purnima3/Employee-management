const nodemailer = require('nodemailer');
require('dotenv').config(); 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465, // or 587
    secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS, 
  },
  tls: {
    rejectUnauthorized: false, // Disables SSL verification (not recommended for production)
},
});

const sendEmail = async (email, password) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'New User Created',
    text: `A new user has been created with the following credentials:\n\nEmail: ${email}\nPassword: ${password}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };


