const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

// Add a transaction (expense or income)
router.post("/", auth, async (req, res) => {
  console.log("📥 Request body:", req.body);
  try {
    const { title, amount, date, type } = req.body;
    const transaction = new Transaction({
      title,
      amount,
      date,
      type,
      user: req.user.id,
    });
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all transactions
router.get("/", auth, async (req, res) => {
  try {
    const { type } = req.query; // filter by type
    const filter = { user: req.user.id };
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update a transaction
router.put("/:id", auth, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.user.id)
      return res.status(404).json({ message: "Transaction not found" });

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a transaction
router.delete("/:id", auth, async (req, res) => {
  // console.log(req.body)
  console.log(req.params.id);
  try {
    const { id } = req.params; // get id from URL

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.user.id)
      return res.status(404).json({ message: "Transaction not found" });

    await Transaction.findByIdAndDelete(id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
