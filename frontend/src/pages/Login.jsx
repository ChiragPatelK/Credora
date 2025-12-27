import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");       
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");     
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),   // ✅ send name instead of email
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", data.user.name);
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setIsError(true);
        setMessage(data.message || "❌ Login failed. Please check credentials.");
      }
    } catch {
      setIsError(true);
      setMessage("⚠️ Network error. Try again later.");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Login to Credora</h2>

        <form onSubmit={handleLogin}>

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}  // ✅ fix: use setName
            required
          />

          {/* Password */}
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

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>

        <p style={{ marginTop: "10px" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
