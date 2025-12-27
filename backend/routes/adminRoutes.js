const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Transaction = require("../models/Transaction");
const isAdmin = require("../middleware/adminAuth");
// const { findById } = require("../models/Transaction");
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const admin = await User.findOne({ name, role: "admin" });
    if (!admin) {
     return res.status(401).json({ message: "Invalid login credentials!" });
    }
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
     return res.status(401).json({ message: "Wrong Password" });
    }
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      admin: { name: admin.name },
      message: "Logged in Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});
//get all transactions
router.get("/transactions", isAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "name") // This will show the user's name
      .sort({ createdAt: -1 }); // Optional: newest first

    res.json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

//get all users
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }); // optional: exclude other admins
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
//delete transaction
router.delete("/transactions/:id", isAdmin, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction Not Found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

//delete user
router.delete("/users/:id", isAdmin, async (req, res) => {
  console.log(req.params.id);
  try {
    const user = await User.findById(req.params.id);
    await User.findByIdAndDelete(req.params.id);
     await Transaction.deleteMany({user: req.params.id});
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server Error" });
  }
});
// ADD USers
router.post("/users", isAdmin, async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Name and password are required" });
    }
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: "User with this name already exists" });
    }
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      password: hashedPassword,
      role: "user", // normal user
    });

    await newUser.save();

    res.status(201).json(newUser); // return the created user
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/users/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check if username already exists (case-insensitive & not same user)
    if (name && name !== user.name) {
      const existingUser = await User.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: "User with this name already exists" });
      }
      user.name = name;
    }

    // ✅ Hash password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // ✅ Allow role change if provided
    if (role) {
      user.role = role;
    }

    await user.save();

    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

//Edit Transactions
router.put("/transactions/:id", isAdmin, async (req, res) => {
  try {
    const updateData = req.body; // e.g., { amount: 100, status: "completed" }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTransaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.json(updatedTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
