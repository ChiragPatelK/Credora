import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); //toggle view
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminName", data.admin?.name || name);
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/admin/dashboard"), 1000);
      } else {
        setIsError(true);
        setMessage(data.message || "❌ Invalid credentials. Try again.");
      }
    } catch (error) {
      console.error("⚠️ Admin login failed:", error);
      setIsError(true);
      setMessage("⚠️ Server error. Try again later.");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleAdminLogin}>
          <input
            type="text"
            placeholder="Admin Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        {message && (
          <p
            style={{
              color: isError ? "#ff6b6b" : "#4ade80",
              marginTop: "10px",
              fontWeight: 500,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;
