const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'employee'], required: true },
  department: { type: String, required: function() { return this.role === 'employee'; } }, 
  password: { type: String, required: true },
  otp: { type: String },
  otpExpiration: { type: Date },
});

// Check if password is already hashed before hashing
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    // Check if password is already hashed
    const isHashed = /^\$2[ayb]\$.{56}$/.test(this.password);
    if (!isHashed) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', userSchema);
