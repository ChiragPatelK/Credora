const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const adminRoutes=require('./routes/adminRoutes')
const authRoutes = require("./routes/authRoutes");
const transaction = require("./routes/transactionRoutes");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/admin",adminRoutes)
app.use("/api/transactions", transaction);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("api working");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
