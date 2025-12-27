const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();
const nodemailer = require("nodemailer");

/* ============================
   REGISTER
============================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password required" });
    }

    // Check username
    const existingName = await User.findOne({ name });
    if (existingName)
      return res.status(400).json({ message: "Username already taken" });

    // Check email
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   LOGIN (email preferred)
============================= */
router.post("/login", async (req, res) => {
  try {
    console.log("📥 Login request body:", req.body);
    const { email, name, password } = req.body;

    const user = await User.findOne({ name, role: "user" });
    if (!user) {
         return res.status(401).json({ message: "Access Forbidden!" });
    }
    // let user;

    // First try login by email
    if (email) {
      user = await User.findOne({ email });
    }

    // Fallback: login by username (to avoid breaking old users)
    if (!user && name) {
      user = await User.findOne({ name });
    }

    if (!user)
      return res.status(400).json({ message: "Invalid login credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid login credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("💥 Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   UPDATE NAME
============================= */
router.put("/update-name", auth, async (req, res) => {
  try {
    const { newName } = req.body;
    if (!newName) {
      return res.status(400).json({ message: "New name is required" });
    }

    const existing = await User.findOne({ name: newName });
    if (existing)
      return res.status(400).json({ message: "That name is already taken" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name: newName },
      { new: true }
    );

    res.json({
      message: "Name updated successfully",
      user: { name: updatedUser.name },
    });
  } catch (err) {
    console.log(err);
  }
});

/* ============================
   UPDATE PASSWORD (Old Password Required)
============================= */
router.put("/update-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res
        .status(400)
        .json({ message: "Current and new passwords required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("💥 Update password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   VERIFY PASSWORD
============================= */
router.post("/verify-password", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    res.json({ message: "Password verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   VERIFY TOKEN
============================= */
router.get("/verify", auth, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

/* ============================
   DEFAULT ROUTE
============================= */
router.get("/", (req, res) => {
  res.send("Auth route working:)");
});

// forgot-password route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    console.log("Forgot password called with email:", email);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log("Sending OTP:", otp);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Credora OTP",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("💥 Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("💥 Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
