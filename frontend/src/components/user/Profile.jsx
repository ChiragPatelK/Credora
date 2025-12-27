import React, { useState, useEffect } from "react";
import "./Userstyle.css";
import { FaMoneyBillWave, FaArrowCircleDown, FaPiggyBank, FaTimes } from "react-icons/fa";
import { verifyPassword, updateUsername, updatePassword, getUserStats } from "../../services/api";

function Profile() {
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
  const [popup, setPopup] = useState(null); // "username" | "password" | null
  const [inputs, setInputs] = useState({ newName: "", password: "", newPass: "", confirmPass: "" });
  const [toast, setToast] = useState({ message: "", type: "" });

  // Load stats once
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const data = await getUserStats(token);
      setStats(data);
    };
    fetchStats();
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (!toast.message) return;
    const t = setTimeout(() => setToast({ message: "", type: "" }), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg, type = "error") => setToast({ message: msg, type });

const handleUsernameChange = async () => {
  if (!(await verifyPassword(inputs.password)))
  {
    setInputs({ newName: "", password: "" });
    return showToast("Incorrect password", "error");
  }

  try {
    const res = await updateUsername(inputs.newName);

    // ✅ Update localStorage so Dashboard picks up new username
    localStorage.setItem("user", inputs.newName);

    showToast(res.message || "Username updated!", "success");
    setPopup(null);
    setInputs({ newName: "", password: "" });

    // ✅ Force reload so the new username shows immediately in Dashboard
    setTimeout(() => {
      window.location.reload();
    }, 800);
  } catch (err) {
    showToast(err.message, "error");
  }
};


  const handlePasswordChange = async () => {
    const { password, newPass, confirmPass } = inputs;
    if (newPass !== confirmPass) return showToast("Passwords do not match", "error");

    try {
      const res = await updatePassword(password, newPass);
      showToast(res.message || "Password updated!", "success");
      setPopup(null);
      setInputs({ newPass: "", confirmPass: "", password: "" });
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const { income, expense, balance } = stats;

  return (
    <div className="pf-container">
      <h1 className="pf-heading">Profile</h1>

      <div className="pf-header-cards">
        <div className="pf-card">
          <FaMoneyBillWave size={40} className="pf-icon" />
          <h3>Income</h3>
          <p>₹{income}</p>
        </div>
        <div className="pf-card">
          <FaArrowCircleDown size={40} className="pf-icon" />
          <h3>Expenses</h3>
          <p>₹{expense}</p>
        </div>
        <div className="pf-card">
          <FaPiggyBank size={40} className="pf-icon" />
          <h3>Balance</h3>
          <p>₹{balance}</p>
        </div>
      </div>

      <div className="pf-actions">
        <h2>Account Settings</h2>
        <button className="pf-btn" onClick={() => setPopup("username")}>Change Username</button>
        <button className="pf-btn" onClick={() => setPopup("password")}>Change Password</button>
      </div>

      {popup && (
        <div className="pf-popup-overlay">
          <div className="pf-popup">
            <FaTimes className="pf-close" onClick={() => setPopup(null)} />
            <h3>
              {popup === "username" ? "Change Username" : "Change Password"}
            </h3>

            {toast.message && (
              <div className={`pf-toast-popup ${toast.type}`}>
                {toast.type === "error" ? "⚠️" : "✅"} {toast.message}
                <button className="pf-toast-close" onClick={() => setToast({ message: "", type: "" })}>✕</button>
              </div>
            )}

            {popup === "username" ? (
              <>
                <input
                  type="text"
                  placeholder="Enter new username"
                  value={inputs.newName}
                  onChange={(e) => setInputs({ ...inputs, newName: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={inputs.password}
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                />
                <button onClick={handleUsernameChange}>Update Username</button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Current password"
                  value={inputs.password}
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={inputs.newPass}
                  onChange={(e) => setInputs({ ...inputs, newPass: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={inputs.confirmPass}
                  onChange={(e) => setInputs({ ...inputs, confirmPass: e.target.value })}
                />
                <button onClick={handlePasswordChange}>Update Password</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
