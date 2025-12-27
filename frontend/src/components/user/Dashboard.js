import React from "react";
import "./Userstyle.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Stats from "./Stats";
import Profile from "./Profile";
import Transaction from "./Transaction";

function Dashboard() {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) navigate("/");

  return (
    <div className="dashboard-container">
      {/* Sidebar Navbar */}
      <Navbar />

      {/* Main content area */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome, {user}! 👋</h1>
        </div>

        {/* Nested Routes */}
        <Routes>
          <Route index element={<Stats />} />
          <Route path="expenses" element={<Transaction type="expense" />} />
          <Route path="income" element={<Transaction type="income" />} />
          <Route path="profile" element={<Profile />} />
          <Route path="stats" element={<Stats />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
