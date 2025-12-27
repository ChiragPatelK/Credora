import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // ✨ new
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }), // ⬅ updated
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("🎉 Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setIsError(true);
        setMessage(data.message || "❌ Registration failed.");
      }
    } catch {
      setIsError(true);
      setMessage("⚠️ Network error. Try again later.");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Register to Credora</h2>

        <form onSubmit={handleRegister}>
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"      // ✨ new
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <button type="submit">Register</button>
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
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
