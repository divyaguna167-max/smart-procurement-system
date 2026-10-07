import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./Dashboard";
import Products from "./Products";
import Procurement from "./Procurement";
import Suppliers from "./Suppliers";
import Reports from "./Reports";
import Billing from "./Billing";
import AIInsights from "./AIInsights";
import Login from "./Login";
import BusinessType from "./BusinessType";
import Settings from "./Settings/Settings";

import { DataProvider } from "./DataContext";

import "./App.css";

function MainApp({
  selectedBusiness,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    setSidebarOpen(true);
    onLogout();
  };

  return (
    <div className={`app ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-logo">
            SP
          </div>

          <div className="brand-text">
            <h2>SmartProcure</h2>
            <span>AI PROCUREMENT</span>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>

        </div>

        {/* BUSINESS */}
        <div className="sidebar-business">

          <div className="business-icon">
            {selectedBusiness?.icon || "🏢"}
          </div>

          <div>
            <span>Business</span>
            <strong>
              {selectedBusiness?.title || "Electronics Shop"}
            </strong>
          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">

          <div className="nav-section-title">
            MAIN MENU
          </div>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/billing"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">🧾</span>
            <span>Billing</span>
          </NavLink>

          <NavLink
            to="/procurement"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">🛒</span>
            <span>Procurement</span>
          </NavLink>

          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">🚚</span>
            <span>Suppliers</span>
          </NavLink>

          <div className="nav-section-title second-section">
            ANALYTICS
          </div>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">📊</span>
            <span>Reports</span>
          </NavLink>

          <NavLink
            to="/ai-insights"
            className={({ isActive }) =>
              `nav-link ai-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">✨</span>
            <span>AI Insights</span>
            <span className="ai-menu-badge">AI</span>
          </NavLink>

        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="sidebar-bottom">

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebarOnMobile}
          >
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </NavLink>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================================
          MAIN AREA
      ========================================= */}
      <div className="main-layout">

        {/* HEADER */}
        <header className="top-header">

          <div className="header-left">

            <button
              className="hamburger-button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className="header-page-info">
              <span>Smart Procurement System</span>
              <strong>
                {selectedBusiness?.title || "Management Dashboard"}
              </strong>
            </div>

          </div>

          <div className="header-right">

            <button
              className="header-icon-button"
              title="Notifications"
            >
              🔔
              <span className="notification-dot"></span>
            </button>

            <div className="header-profile">

              <div className="profile-avatar">
                A
              </div>

              <div className="profile-details">
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="page-content">

          <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/billing"
              element={<Billing />}
            />

            <Route
              path="/procurement"
              element={<Procurement />}
            />

            <Route
              path="/suppliers"
              element={<Suppliers />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/ai-insights"
              element={<AIInsights />}
            />

            <Route
              path="/settings"
              element={
                <Settings
                  selectedBusiness={selectedBusiness}
                  onLogout={handleLogout}
                />
              }
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}

/* =========================================
   ROOT APP
========================================= */

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleBusinessContinue = (business) => {
    setSelectedBusiness(business);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedBusiness(null);
  };

  /* LOGIN */
  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  /* BUSINESS TYPE */
  if (!selectedBusiness) {
    return (
      <BusinessType
        onContinue={handleBusinessContinue}
      />
    );
  }

  /* MAIN SYSTEM */
  return (
    <DataProvider selectedBusiness={selectedBusiness}>

      <BrowserRouter>

        <MainApp
          selectedBusiness={selectedBusiness}
          onLogout={handleLogout}
        />

      </BrowserRouter>

    </DataProvider>
  );
}

export default App;