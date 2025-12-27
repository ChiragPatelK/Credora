import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Userstyle.css";
import DashboardImg from "../../assets/images/Dashboard.svg";
import { LogOut } from "lucide-react"; // nice icon

const DashboardNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h1 className="logo">CREDORA</h1>

      <nav className="nav-links">
        <Link
          to="/dashboard"
          className={isActive("/dashboard") ? "active" : ""}
        >
          <img
            src={DashboardImg}
            alt="Dashboard"
            className="dashboard-image"
          />
          Dashboard
        </Link>

        <Link
          to="/dashboard/expenses"
          className={isActive("/dashboard/expenses") ? "active" : ""}
        >
          💸 Expenses
        </Link>

        <Link
          to="/dashboard/income"
          className={isActive("/dashboard/income") ? "active" : ""}
        >
          💵 Income
        </Link>

        <Link
          to="/dashboard/profile"
          className={isActive("/dashboard/profile") ? "active" : ""}
        >
          👤 Profile
        </Link>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} className="logout-icon" /> Logout
      </button>
    </aside>
  );
};

export default DashboardNavbar;
