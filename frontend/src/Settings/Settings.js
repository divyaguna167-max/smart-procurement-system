import React from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings({ selectedBusiness, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="settings-page">

      {/* PAGE HEADER */}
      <div className="settings-header">
        <div>
          <p className="settings-eyebrow">SYSTEM SETTINGS</p>
          <h1>Settings</h1>
          <p>
            Manage your SmartProcure account and application preferences.
          </p>
        </div>

        <button
          className="settings-back-btn"
          onClick={() => navigate("/")}
          type="button"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* PROFILE SECTION */}
      <section className="settings-card">
        <div className="settings-card-title">
          <div className="settings-section-icon">👤</div>

          <div>
            <h2>Profile</h2>
            <p>Your administrator account information</p>
          </div>
        </div>

        <div className="settings-profile">
          <div className="settings-avatar">
            AD
          </div>

          <div className="settings-profile-info">
            <h3>Admin User</h3>
            <p>Administrator</p>
            <span className="settings-status">
              ● Active Account
            </span>
          </div>
        </div>
      </section>

      {/* BUSINESS SECTION */}
      <section className="settings-card">
        <div className="settings-card-title">
          <div className="settings-section-icon">🏪</div>

          <div>
            <h2>Business Information</h2>
            <p>Currently selected business type</p>
          </div>
        </div>

        <div className="business-info-box">
          <div className="business-info-icon">
            {selectedBusiness?.icon || "🏪"}
          </div>

          <div>
            <span>Selected Business</span>
            <h3>
              {selectedBusiness?.title || "SmartProcure Business"}
            </h3>
          </div>
        </div>
      </section>

      {/* APPLICATION SETTINGS */}
      <section className="settings-card">
        <div className="settings-card-title">
          <div className="settings-section-icon">⚙️</div>

          <div>
            <h2>Application Preferences</h2>
            <p>SmartProcure application information</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <h3>AI Smart Insights</h3>
            <p>
              AI-powered demand prediction and procurement
              recommendations are enabled.
            </p>
          </div>

          <span className="enabled-badge">
            Enabled
          </span>
        </div>

        <div className="settings-option">
          <div>
            <h3>Inventory Monitoring</h3>
            <p>
              Monitor stock levels and identify low-stock products
              automatically.
            </p>
          </div>

          <span className="enabled-badge">
            Active
          </span>
        </div>

        <div className="settings-option">
          <div>
            <h3>Automatic Stock Updates</h3>
            <p>
              Billing and procurement transactions update inventory
              quantities automatically.
            </p>
          </div>

          <span className="enabled-badge">
            Active
          </span>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="settings-card about-card">
        <div className="settings-card-title">
          <div className="settings-section-icon">ℹ️</div>

          <div>
            <h2>About SmartProcure</h2>
            <p>Application information</p>
          </div>
        </div>

        <div className="about-content">
          <div className="about-logo">
            SP
          </div>

          <div>
            <h3>SmartProcure</h3>
            <p>
              AI Powered Smart Procurement & Inventory Management System
            </p>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </section>

      {/* LOGOUT */}
      <section className="logout-card">
        <div>
          <h2>Logout</h2>
          <p>
            Sign out from your SmartProcure administrator session.
          </p>
        </div>

        <button
          className="logout-btn"
          type="button"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>
      </section>

    </div>
  );
}

export default Settings;