import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import "./Adminstyles.css";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <aside className="sidebar">
      <h1 className="logo">⚡ Credora Admin</h1>

      <nav className="nav-links">
        <Link
          to="/admin/dashboard"
          className={isActive("/admin/dashboard") ? "active" : ""}
        >
          📊 Dashboard
        </Link>
        <Link
          to="/admin/users"
          className={isActive("/admin/users") ? "active" : ""}
        >
          👥 Manage Users
        </Link>
        <Link
          to="/admin/transactions"
          className={isActive("/admin/transactions") ? "active" : ""}
        >
          💰 Manage Transactions
        </Link>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} className="logout-icon" /> Logout
      </button>
    </aside>
  );
};

export default AdminNavbar;
