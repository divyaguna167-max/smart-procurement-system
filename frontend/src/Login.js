import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter Email and Password");
      return;
    }

    // Demo Login
    onLogin();
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}

      <div className="login-left">

        <div className="login-brand">

          <div className="login-logo">
            SP
          </div>

          <div>
            <h2>SmartProcure</h2>
            <p>AI PROCUREMENT SYSTEM</p>
          </div>

        </div>


        <div className="login-content">

          <div className="login-badge">
            ✦ AI POWERED PLATFORM
          </div>

          <h1>
            Smart Procurement.
            <br />
            Smarter Business.
          </h1>

          <p>
            Manage inventory, suppliers, procurement and
            business operations with one intelligent platform.
          </p>


          <div className="login-features">

            <div className="login-feature">
              <span>📦</span>

              <div>
                <h3>Smart Inventory</h3>
                <p>Track products and stock in real time.</p>
              </div>
            </div>


            <div className="login-feature">
              <span>🤖</span>

              <div>
                <h3>AI Insights</h3>
                <p>Make better procurement decisions.</p>
              </div>
            </div>


            <div className="login-feature">
              <span>📊</span>

              <div>
                <h3>Business Analytics</h3>
                <p>Monitor your business performance.</p>
              </div>
            </div>

          </div>

        </div>


        <div className="login-footer-text">
          © 2026 SmartProcure AI
        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="login-right">

        <div className="login-card">

          <div className="login-card-header">

            <h1>Welcome Back 👋</h1>

            <p>
              Sign in to manage your business smarter.
            </p>

          </div>


          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="login-form-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>


            {/* PASSWORD */}

            <div className="login-form-group">

              <label>Password</label>

              <div className="password-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>


            {/* REMEMBER */}

            <div className="login-options">

              <label className="remember-me">

                <input type="checkbox" />

                Remember me

              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot Password?
              </button>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
            >
              Sign In →
            </button>


            <div className="login-divider">

              <span>Secure access to SmartProcure AI</span>

            </div>


            <div className="login-demo-info">

              <span>🔒</span>

              Your business data is securely managed.

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;