import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ added
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setIsError(true);
        setMessage(data.message || "❌ Failed to reset password");
      }
    } catch {
      setIsError(true);
      setMessage("⚠️ Network error. Try again later.");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Reset Password</h2>

        <form onSubmit={handleResetPassword}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          {/* Password field with show/hide */}
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">Reset Password</button>
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

export default ResetPassword;
