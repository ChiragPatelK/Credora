import React from "react";
import { useNavigate } from "react-router-dom";
import "./InfoPage.css";
import logo from "../assets/images/Black White Minimal Modern Simple Bold Business Mag Logo.png";

function InfoPage() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="info-page">
      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="nav-left" onClick={() => scrollToSection("home")}>
          <img src={logo} alt="CREDORA Logo" className="nav-logo" />
        </div>

        <div className="nav-right">
          <button onClick={() => scrollToSection("home")}>Home</button>
          <button onClick={() => scrollToSection("about")}>About</button>
          <button onClick={() => scrollToSection("features")}>Features</button>
          <button onClick={() => scrollToSection("contact")}>Contact</button>
          <button onClick={() => navigate("/login")} className="nav-btn">
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="nav-btn-outline"
          >
            Register
          </button>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section id="home" className="hero-section">
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <h1>
            Manage Your <span>Finances</span> Smarter
          </h1>
          <p>
            CREDORA helps you track income, monitor spending, and achieve
            financial balance through one secure, intuitive dashboard.
          </p>
        </div>
        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4072/4072559.png"
            alt="Finance illustration"
          />
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          CREDORA was created to simplify financial management for everyone.
          Whether you're planning a monthly budget or tracking business
          expenses, we make it effortless to visualize and control your money.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4105/4105456.png"
          alt="About illustration"
          className="section-image"
        />
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="features">
        <h2>Why Choose CREDORA?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📊 Smart Analytics</h3>
            <p>Visualize spending trends and patterns with interactive graphs.</p>
          </div>
          <div className="feature-card">
            <h3>💸 Expense Tracking</h3>
            <p>Keep an eye on every transaction in real-time.</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Secure Data</h3>
            <p>Your information is protected using end-to-end encryption.</p>
          </div>
          <div className="feature-card">
            <h3>☁️ Cloud Access</h3>
            <p>Access your dashboard anywhere, on any device.</p>
          </div>
        </div>
      </section>

      {/* ===== GET STARTED ===== */}
      <section className="get-started">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands who manage their finances smarter with CREDORA.</p>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Try Web App
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>Have questions? We'd love to hear from you.</p>
        <div className="contact-buttons">
          <a href="mailto:greenwich273@gmail.com" className="btn-primary">
            📧 Email Us
          </a>
          <a
            href="https://github.com/ArsenicZenen/Credora"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            🌐 View on GitHub
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} CREDORA | Made with ❤️ by Yash & Chirag
        </p>
      </footer>
    </div>
  );
}

export default InfoPage;
