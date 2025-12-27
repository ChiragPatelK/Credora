import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("📩 OTP sent to your email!");
        setTimeout(() => navigate("/reset-password?email=" + email), 1200);
      } else {
        setIsError(true);
        setMessage(data.message || "❌ Failed to send OTP.");
      }
    } catch {
      setIsError(true);
      setMessage("⚠️ Network error. Try again later.");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSendOTP}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Send OTP</button>
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
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
