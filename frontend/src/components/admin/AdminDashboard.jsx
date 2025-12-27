import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Adminstyles.css"; // new file for styling
import { FaUsers, FaExchangeAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [usersCount, setUsersCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const [resUsers, resTrans] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/admin/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!resUsers.ok || !resTrans.ok)
          throw new Error("Failed to fetch admin data");

        const users = await resUsers.json();
        const transactions = await resTrans.json();
        setUsersCount(users.length);
        setTransactionsCount(transactions.length);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [navigate]);

  if (loading) return null;

  if (error)
    return (
      <div className="admin-dashboard-error">
        <h2>⚠️ Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/admin/login")}>Login Again</button>
      </div>
    );

  return (
    <div className="admin-dashboard-page">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-cards">
        <div className="admin-card users">
          <FaUsers className="admin-icon" />
          <div className="card-content">
            <h3>Total Users</h3>
            <p>{usersCount}</p>
          </div>
        </div>

        <div className="admin-card transactions">
          <FaExchangeAlt className="admin-icon" />
          <div className="card-content">
            <h3>Total Transactions</h3>
            <p>{transactionsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
