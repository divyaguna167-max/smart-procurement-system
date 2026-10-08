import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "./DataContext";
import "./AIInsights.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://127.0.0.1:5000";

function AIInsights() {
  const navigate = useNavigate();
  const { products, billingHistory } = useData();

  const [aiResults, setAiResults] = useState({});
  const [aiLoading, setAiLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("checking");

  // ==========================================
  // INVENTORY STATISTICS
  // ==========================================

  const inventoryStats = useMemo(() => {
    const lowStock = products.filter(
      (p) =>
        Number(p.stock) > 0 &&
        Number(p.stock) <= Number(p.minStock)
    );

    const outOfStock = products.filter(
      (p) => Number(p.stock) === 0
    );

    const healthyStock = products.filter(
      (p) => Number(p.stock) > Number(p.minStock)
    );

    return {
      total: products.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      healthy: healthyStock.length
    };
  }, [products]);

  // ==========================================
  // SALES DATA
  // ==========================================

  const getSalesData = (product) => {
    const salesData = [];

    billingHistory.forEach((bill) => {
      if (!Array.isArray(bill.items)) return;

      bill.items.forEach((item) => {
        const sameProduct =
          String(item.productId) === String(product.id) ||
          String(item.id) === String(product.id) ||
          String(item.product) === String(product.name);

        if (!sameProduct) return;

        const quantity = Number(
          item.quantity ||
          item.unitsSold ||
          item.qty ||
          0
        );

        if (quantity > 0) {
          salesData.push(quantity);
        }
      });
    });

    return salesData;
  };

  // ==========================================
  // FETCH AI PREDICTIONS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const fetchPredictions = async () => {
      setAiLoading(true);
      setBackendStatus("checking");

      const results = {};
      let successful = 0;

      for (const product of products) {
        if (cancelled) break;

        const actualSales = getSalesData(product);

        const usableSales =
          actualSales.length >= 2
            ? actualSales
            : [
                Math.max(
                  1,
                  Math.round(
                    Number(product.minStock || 5) * 0.8
                  )
                ),
                Math.max(
                  1,
                  Math.round(
                    Number(product.minStock || 5)
                  )
                ),
                Math.max(
                  1,
                  Math.round(
                    Number(product.stock || 1)
                  )
                )
              ];

        try {
          const response = await fetch(
            `${API_URL}/api/ai/predict`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                product_name: product.name,
                sales_data: usableSales,
                current_stock: Number(
                  product.stock || 0
                ),
                min_stock: Number(
                  product.minStock || 0
                )
              })
            }
          );

          if (!response.ok) continue;

          const data = await response.json();

          if (data.status !== "success") continue;

          results[product.id] = {
            ...data,
            productId: product.id,
            productName: product.name,
            currentStock: Number(
              product.stock || 0
            ),
            minStock: Number(
              product.minStock || 0
            )
          };

          successful += 1;
        } catch (error) {
          console.log(
            `AI prediction failed for ${product.name}`
          );
        }
      }

      if (!cancelled) {
        setAiResults(results);
        setBackendStatus(
          successful > 0 ? "online" : "offline"
        );
        setAiLoading(false);
      }
    };

    if (products.length > 0) {
      fetchPredictions();
    } else {
      setAiLoading(false);
      setBackendStatus("offline");
    }

    return () => {
      cancelled = true;
    };
  }, [products, billingHistory]);

  // ==========================================
  // PREDICTION LIST
  // ==========================================

  const predictionList = useMemo(() => {
    return products
      .map((product) => {
        const result = aiResults[product.id];

        if (!result) return null;

        return {
          product,
          result
        };
      })
      .filter(Boolean);
  }, [products, aiResults]);

  // ==========================================
  // HIGH DEMAND PRODUCTS
  // ==========================================

  const highDemandProducts = useMemo(() => {
    return predictionList.filter(({ result }) => {
      const demand = String(
        result.demand_level ||
        result.demandLevel ||
        result.demand ||
        ""
      ).toLowerCase();

      return (
        demand.includes("very high") ||
        demand === "high"
      );
    });
  }, [predictionList]);

  // ==========================================
  // RECOMMENDATIONS
  // ==========================================

  const recommendations = useMemo(() => {
    return predictionList
      .map(({ product, result }) => {
        const recommendedPurchase = Number(
          result.recommended_purchase ??
          result.recommendedPurchase ??
          result.recommended_quantity ??
          0
        );

        const demand = String(
          result.demand_level ||
          result.demandLevel ||
          result.demand ||
          "Medium"
        );

        let priority = String(
          result.priority || ""
        );

        if (!priority) {
          const demandLower =
            demand.toLowerCase();

          if (
            demandLower.includes("very high")
          ) {
            priority = "Critical";
          } else if (
            demandLower.includes("high")
          ) {
            priority = "High";
          } else {
            priority = "Normal";
          }
        }

        const marketBrand =
          result.market_brand ||
          result.marketBrand ||
          "";

        const marketShare =
          result.market_share ??
          result.marketShare ??
          null;

        const marketTrend =
          result.market_trend ||
          result.marketTrend ||
          "";

        return {
          product,
          result,
          recommendedPurchase,
          demand,
          priority,
          marketBrand,
          marketShare,
          marketTrend
        };
      })
      .filter(
        (item) =>
          item.recommendedPurchase > 0 ||
          Number(item.product.stock) <=
            Number(item.product.minStock)
      )
      .sort((a, b) => {
        const order = {
          Critical: 1,
          High: 2,
          Normal: 3
        };

        return (
          (order[a.priority] || 4) -
          (order[b.priority] || 4)
        );
      });
  }, [predictionList]);

  // ==========================================
  // TOTAL PURCHASE
  // ==========================================

  const totalRecommendedPurchase =
    recommendations.reduce(
      (sum, item) =>
        sum + item.recommendedPurchase,
      0
    );

  // ==========================================
  // CREATE PURCHASE ORDER
  // ==========================================

  const handleCreatePurchaseOrder = (item) => {
    const quantity = Math.max(
      1,
      Number(
        item.recommendedPurchase || 1
      )
    );

    navigate(
      `/procurement?product=${item.product.id}&quantity=${quantity}`
    );
  };

  // ==========================================
  // CLASSES
  // ==========================================

  const getPriorityClass = (priority) => {
    const value = String(
      priority
    ).toLowerCase();

    if (value === "critical") return "critical";
    if (value === "high") return "high";

    return "normal";
  };

  const getDemandClass = (demand) => {
    const value = String(
      demand
    ).toLowerCase();

    if (
      value.includes("very high") ||
      value === "high"
    ) {
      return "very-high";
    }

    if (value === "low") {
      return "low";
    }

    return "medium";
  };

  // ==========================================
  // MARKET DISPLAY
  // ==========================================

  const getMarketDisplay = (
    brand,
    share,
    trend
  ) => {
    const validMarketData =
      brand &&
      brand !== "Unknown" &&
      Number(share) > 0;

    if (!validMarketData) {
      return {
        brand: "Not Available",
        share: "—",
        trend: "—"
      };
    }

    return {
      brand,
      share: `${share}%`,
      trend: trend || "—"
    };
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (aiLoading) {
    return (
      <div className="ai-insights-page">

        <div className="page-header">
          <div>
            <div className="page-eyebrow">
              INTELLIGENT ANALYTICS
            </div>

            <h1>AI Insights</h1>

            <p className="page-description">
              Analyze inventory, historical sales
              and AI demand predictions to generate
              intelligent procurement recommendations.
            </p>
          </div>
        </div>

        <div className="ai-loading-card">
          <div className="ai-loading-icon">
            ✦
          </div>

          <h2>
            AI Prediction Engine
          </h2>

          <p>
            Python machine learning engine is
            analyzing inventory and demand data...
          </p>

          <div className="ai-loading-text">
            Generating predictions...
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="ai-insights-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <div className="page-eyebrow">
            INTELLIGENT ANALYTICS
          </div>

          <h1>AI Insights</h1>

          <p className="page-description">
            Analyze inventory, historical sales
            and AI demand predictions to generate
            intelligent procurement recommendations.
          </p>
        </div>

        <div className="ai-header-status">

          <span
            className={
              backendStatus === "online"
                ? "status-dot online"
                : "status-dot"
            }
          />

          <div>
            <strong>
              AI Engine Active
            </strong>

            <small>
              Python ML prediction service
            </small>
          </div>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="ai-summary-grid">

        <div className="ai-summary-card">
          <div className="ai-summary-icon purple">
            ✦
          </div>

          <div>
            <span>Products Analyzed</span>
            <strong>{inventoryStats.total}</strong>
            <small>Inventory products</small>
          </div>
        </div>

        <div className="ai-summary-card">
          <div className="ai-summary-icon orange">
            ⚠
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{inventoryStats.lowStock}</strong>
            <small>Need attention</small>
          </div>
        </div>

        <div className="ai-summary-card">
          <div className="ai-summary-icon red">
            !
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>
              {inventoryStats.outOfStock}
            </strong>
            <small>Immediate action</small>
          </div>
        </div>

        <div className="ai-summary-card">
          <div className="ai-summary-icon green">
            ✓
          </div>

          <div>
            <span>Healthy Stock</span>
            <strong>{inventoryStats.healthy}</strong>
            <small>Stock is sufficient</small>
          </div>
        </div>

      </div>

      {/* AI ENGINE */}

      <div className="ai-engine-card">

        <div className="ai-engine-icon">
          ✦
        </div>

        <div className="ai-engine-content">

          <div className="ai-section-label">
            AI Prediction Engine
          </div>

          <h2>
            Python Machine Learning Engine
          </h2>

          <p>
            Python machine learning engine analyzes
            historical sales and current inventory
            to predict future demand.
          </p>

        </div>

        <div className="ai-engine-status">
          <span className="status-dot online" />
          Prediction Ready
        </div>

      </div>

      {/* HIGH DEMAND */}

      <section className="ai-section">

        <div className="ai-section-heading">

          <div>
            <span className="ai-section-label">
              MARKET DEMAND
            </span>

            <h2>
              High Demand Products
            </h2>

            <p>
              Products predicted to have strong
              future demand.
            </p>
          </div>

          <div className="ai-count-badge">
            {highDemandProducts.length}
          </div>

        </div>

        <div className="high-demand-grid">

          {highDemandProducts.length > 0 ? (
            highDemandProducts.map(
              ({ product, result }) => {

                const demand =
                  result.demand_level ||
                  result.demandLevel ||
                  "High";

                return (
                  <div
                    className="high-demand-card"
                    key={product.id}
                  >

                    <div className="demand-product-icon">
                      {product.name
                        ? product.name
                            .charAt(0)
                            .toUpperCase()
                        : "P"}
                    </div>

                    <div className="demand-product-info">

                      <h3>{product.name}</h3>

                      <p>
                        Current stock:{" "}
                        {product.stock}
                        {" · "}
                        Minimum:{" "}
                        {product.minStock}
                      </p>

                    </div>

                    <span
                      className={`demand-badge ${getDemandClass(
                        demand
                      )}`}
                    >
                      {demand}
                    </span>

                  </div>
                );
              }
            )
          ) : (
            <div className="ai-empty-state">
              No high demand products detected.
            </div>
          )}

        </div>

      </section>

      {/* SMART PROCUREMENT */}

      <section className="ai-section">

        <div className="ai-section-heading">

          <div>
            <span className="ai-section-label">
              SMART PROCUREMENT
            </span>

            <h2>
              AI Purchase Recommendations
            </h2>

            <p>
              Recommended purchase quantities based
              on stock, demand and AI prediction.
            </p>
          </div>

          <div className="total-purchase-badge">
            <span>Total Units</span>

            <strong>
              {totalRecommendedPurchase}
            </strong>
          </div>

        </div>

        <div className="recommendations-grid">

          {recommendations.length > 0 ? (

            recommendations.map((item) => {

              const market =
                getMarketDisplay(
                  item.marketBrand,
                  item.marketShare,
                  item.marketTrend
                );

              return (
                <div
                  className="recommendation-card"
                  key={item.product.id}
                >

                  {/* PRODUCT */}

                  <div className="recommendation-header">

                    <div className="recommendation-product">

                      <div className="recommendation-icon">
                        {item.product.name
                          ? item.product.name
                              .charAt(0)
                              .toUpperCase()
                          : "P"}
                      </div>

                      <div>
                        <h3>
                          {item.product.name}
                        </h3>

                        <p>
                          Current stock:{" "}
                          {item.product.stock}
                          {" · "}
                          Minimum:{" "}
                          {item.product.minStock}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* MARKET */}

                  <div className="market-info">

                    <span>Market:</span>

                    <strong>
                      {market.brand}
                    </strong>

                    <span>· Share:</span>

                    <strong>
                      {market.share}
                    </strong>

                    <span>· Trend:</span>

                    <strong>
                      {market.trend}
                    </strong>

                  </div>

                  {/* DETAILS */}

                  <div className="recommendation-details">

                    <div className="recommendation-detail">
                      <span>Demand</span>

                      <strong
                        className={`demand-text ${getDemandClass(
                          item.demand
                        )}`}
                      >
                        {item.demand}
                      </strong>
                    </div>

                    <div className="recommendation-detail">
                      <span>Purchase</span>

                      <strong className="purchase-text">
                        +{item.recommendedPurchase}
                      </strong>
                    </div>

                    <div className="recommendation-detail">
                      <span>Priority</span>

                      <strong
                        className={`priority-text ${getPriorityClass(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </strong>
                    </div>

                  </div>

                  {/* BUTTON */}

                  <button
                    type="button"
                    className="create-purchase-button"
                    onClick={() =>
                      handleCreatePurchaseOrder(item)
                    }
                  >
                    Create Purchase Order
                    <span>→</span>
                  </button>

                </div>
              );
            })

          ) : (

            <div className="ai-empty-state">

              <div className="ai-empty-icon">
                ✓
              </div>

              <h3>
                Inventory is Healthy
              </h3>

              <p>
                No immediate procurement
                recommendations are required.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* HOW AI WORKS */}

      <div className="ai-how-card">

        <div className="ai-how-icon">
          ✦
        </div>

        <div>

          <span className="ai-section-label">
            HOW SMARTPROCURE AI WORKS
          </span>

          <h2>
            Intelligent Demand & Procurement
          </h2>

          <p>
            The AI engine combines historical sales,
            current stock and minimum stock levels
            to estimate future product requirements.
            The machine learning model then generates
            a procurement recommendation to help reduce
            stock-outs and improve inventory planning.
          </p>

        </div>

      </div>

    </div>
  );
}

export default AIInsights;