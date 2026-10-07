import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "./DataContext";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const {
    products = [],
    suppliers = [],
    purchaseOrders = [],
    billingHistory = [],
  } = useData();

  /* =========================================
     DASHBOARD STATS
  ========================================= */

  const stats = useMemo(() => {

    const totalProducts = products.length;

    const totalStock = products.reduce(
      (sum, product) =>
        sum + Number(product.stock || 0),
      0
    );

    const lowStock = products.filter(
      (product) =>
        Number(product.stock || 0) > 0 &&
        Number(product.stock || 0) <=
          Number(product.minStock || 0)
    ).length;

    const outOfStock = products.filter(
      (product) =>
        Number(product.stock || 0) === 0
    ).length;

    const totalSales = billingHistory.reduce(
      (sum, bill) =>
        sum + Number(
          bill.totalAmount ||
          bill.total ||
          0
        ),
      0
    );

    const today = new Date()
      .toLocaleDateString();

    const todayBills = billingHistory.filter(
      (bill) => {
        if (!bill.date) return false;

        return new Date(
          bill.date
        ).toLocaleDateString() === today;
      }
    ).length;

    return {
      totalProducts,
      totalStock,
      lowStock,
      outOfStock,
      totalSales,
      todayBills,
    };

  }, [products, billingHistory]);

  /* =========================================
     INVENTORY HEALTH
  ========================================= */

  const inventoryHealth = useMemo(() => {

    const healthy = products.filter(
      (product) =>
        Number(product.stock || 0) >
        Number(product.minStock || 0)
    ).length;

    const low = products.filter(
      (product) =>
        Number(product.stock || 0) > 0 &&
        Number(product.stock || 0) <=
          Number(product.minStock || 0)
    ).length;

    const out = products.filter(
      (product) =>
        Number(product.stock || 0) === 0
    ).length;

    return {
      healthy,
      low,
      out,
    };

  }, [products]);

  /* =========================================
     AI RECOMMENDATION
  ========================================= */

  const recommendedProduct = useMemo(() => {

    if (!products.length) {
      return null;
    }

    const outOfStockProduct = products.find(
      (product) =>
        Number(product.stock || 0) === 0
    );

    if (outOfStockProduct) {
      return outOfStockProduct;
    }

    const lowStockProducts = products.filter(
      (product) =>
        Number(product.stock || 0) <=
        Number(product.minStock || 0)
    );

    if (!lowStockProducts.length) {
      return null;
    }

    return [...lowStockProducts].sort(
      (a, b) => {

        const ratioA =
          Number(a.stock || 0) /
          Math.max(Number(a.minStock || 1), 1);

        const ratioB =
          Number(b.stock || 0) /
          Math.max(Number(b.minStock || 1), 1);

        return ratioA - ratioB;
      }
    )[0];

  }, [products]);

  const recommendedQuantity = recommendedProduct
    ? Math.max(
        1,
        Number(recommendedProduct.minStock || 0) * 2 -
        Number(recommendedProduct.stock || 0)
      )
    : 0;

  /* =========================================
     FORMAT CURRENCY
  ========================================= */

  const formatCurrency = (amount) => {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount || 0);

  };

  /* =========================================
     TODAY
  ========================================= */

  const todayText = new Date().toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  /* =========================================
     JSX
  ========================================= */

  return (
    <div className="dashboard-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="page-header">

        <div>

          <p className="page-eyebrow">
            ✦ SMART PROCUREMENT
          </p>

          <h1>
            Welcome Back, Admin 👋
          </h1>

          <p className="page-description">
            Monitor inventory, procurement activities
            and AI-powered insights from one place.
          </p>

        </div>

        <div className="dashboard-date">
          📅 {todayText}
        </div>

      </div>

      {/* =====================================
          STAT CARDS
      ===================================== */}

      <div className="dashboard-stats-grid">

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon purple">
            📦
          </div>

          <div className="dashboard-stat-content">

            <p className="dashboard-stat-label">
              Total Products
            </p>

            <h2 className="dashboard-stat-value">
              {stats.totalProducts}
            </h2>

            <p className="dashboard-stat-subtitle">
              Products in inventory
            </p>

          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon blue">
            📊
          </div>

          <div className="dashboard-stat-content">

            <p className="dashboard-stat-label">
              Current Stock
            </p>

            <h2 className="dashboard-stat-value">
              {stats.totalStock}
            </h2>

            <p className="dashboard-stat-subtitle">
              Available inventory units
            </p>

          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon orange">
            ⚠️
          </div>

          <div className="dashboard-stat-content">

            <p className="dashboard-stat-label">
              Low Stock
            </p>

            <h2 className="dashboard-stat-value">
              {stats.lowStock}
            </h2>

            <p className="dashboard-stat-subtitle">
              Need attention
            </p>

          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon red">
            🚨
          </div>

          <div className="dashboard-stat-content">

            <p className="dashboard-stat-label">
              Out of Stock
            </p>

            <h2 className="dashboard-stat-value">
              {stats.outOfStock}
            </h2>

            <p className="dashboard-stat-subtitle">
              Immediate action
            </p>

          </div>

        </div>

      </div>

      {/* =====================================
          MAIN GRID
      ===================================== */}

      <div className="dashboard-main-grid">

        {/* INVENTORY HEALTH */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <h2 className="dashboard-card-title">
                Inventory Health
              </h2>

              <p className="dashboard-card-subtitle">
                Current stock status
              </p>

            </div>

            <div className="dashboard-card-icon">
              📦
            </div>

          </div>

          <div className="inventory-health-list">

            <div className="inventory-health-item">

              <div className="health-left">

                <span className="health-dot healthy"></span>

                <span>
                  Healthy Stock
                </span>

              </div>

              <strong className="inventory-health-value">
                {inventoryHealth.healthy}
              </strong>

            </div>

            <div className="inventory-health-item">

              <div className="health-left">

                <span className="health-dot low"></span>

                <span>
                  Low Stock
                </span>

              </div>

              <strong className="inventory-health-value">
                {inventoryHealth.low}
              </strong>

            </div>

            <div className="inventory-health-item">

              <div className="health-left">

                <span className="health-dot out"></span>

                <span>
                  Out of Stock
                </span>

              </div>

              <strong className="inventory-health-value">
                {inventoryHealth.out}
              </strong>

            </div>

          </div>

        </div>

        {/* SALES OVERVIEW */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <h2 className="dashboard-card-title">
                Sales Overview
              </h2>

              <p className="dashboard-card-subtitle">
                Billing performance
              </p>

            </div>

            <div className="dashboard-card-icon">
              💰
            </div>

          </div>

          <div className="sales-overview">

            <div className="sales-overview-row">

              <span className="sales-overview-label">
                Total Sales
              </span>

              <strong className="sales-overview-value">
                {formatCurrency(stats.totalSales)}
              </strong>

            </div>

            <div className="sales-overview-row">

              <span className="sales-overview-label">
                Bills Generated
              </span>

              <strong className="sales-overview-value">
                {billingHistory.length}
              </strong>

            </div>

            <div className="sales-overview-row">

              <span className="sales-overview-label">
                Today's Bills
              </span>

              <strong className="sales-overview-value">
                {stats.todayBills}
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          AI RECOMMENDATION
      ===================================== */}

      <div className="dashboard-ai-card">

        <div className="dashboard-ai-icon">
          ✨
        </div>

        <div className="dashboard-ai-content">

          <h3>
            AI Smart Recommendation
          </h3>

          {recommendedProduct ? (

            <p>
              <strong>
                {recommendedProduct.name}
              </strong>{" "}
              needs attention. Current stock is{" "}
              <strong>
                {recommendedProduct.stock}
              </strong>{" "}
              units. Recommended purchase:
              <strong>
                {" "}{recommendedQuantity} units.
              </strong>
            </p>

          ) : (

            <p>
              All products are currently maintaining
              healthy stock levels. No immediate
              procurement recommendation.
            </p>

          )}

        </div>

        <div className="dashboard-ai-actions">

          {recommendedProduct && (
            <button
              onClick={() =>
                navigate(
                  `/procurement?product=${recommendedProduct.id}&quantity=${recommendedQuantity}`
                )
              }
            >
              Create Purchase Order
            </button>
          )}

          <button
            onClick={() =>
              navigate("/ai-insights")
            }
          >
            View AI Analysis
          </button>

        </div>

      </div>

      {/* =====================================
          BOTTOM CARDS
      ===================================== */}

      <div className="dashboard-bottom-grid">

        <div className="dashboard-mini-card">

          <div className="mini-icon">
            🚚
          </div>

          <h3>
            Suppliers
          </h3>

          <p>
            {suppliers.length} suppliers available
            for procurement operations.
          </p>

        </div>

        <div className="dashboard-mini-card">

          <div className="mini-icon">
            🛒
          </div>

          <h3>
            Purchase Orders
          </h3>

          <p>
            {purchaseOrders.length} purchase orders
            recorded in the system.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;