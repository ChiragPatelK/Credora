const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true 
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: { 
    type: String,
    required: true 
  },

  role: { 
    type: String, 
    default: "user" 
  },

  // ✅ Fields for OTP / forgot password
  otp: { type: String },       // store OTP as string
  otpExpiry: { type: Date }    // store expiry time
});

module.exports = mongoose.model("User", userSchema);
