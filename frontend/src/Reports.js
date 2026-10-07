import React from "react";
import { useData } from "./DataContext";

function Reports() {
  const {
    products = [],
    suppliers = [],
    purchaseOrders = [],
    billingHistory = [],
  } = useData();

  // =========================
  // INVENTORY CALCULATIONS
  // =========================

  const totalProducts = products.length;

  const totalStockUnits = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) <= Number(product.minStock || 0)
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock || 0) === 0
  );

  // =========================
  // SUPPLIER CALCULATIONS
  // =========================

  const totalSuppliers = suppliers.length;

  // =========================
  // PURCHASE ORDER CALCULATIONS
  // =========================

  const totalPurchaseOrders = purchaseOrders.length;

  const pendingOrders = purchaseOrders.filter(
    (order) =>
      String(order.status || "").toLowerCase() === "pending"
  );

  const approvedOrders = purchaseOrders.filter((order) => {
    const status = String(order.status || "").toLowerCase();

    return (
      status === "approved" ||
      status === "completed"
    );
  });

  const totalPurchaseValue = purchaseOrders.reduce(
    (total, order) => {
      const quantity = Number(order.quantity || 0);

      const product = products.find(
        (item) =>
          Number(item.id) === Number(order.productId)
      );

      const price = Number(
        order.price ||
          order.total ||
          product?.price ||
          0
      );

      return total + quantity * price;
    },
    0
  );

  // =========================
  // BILLING / SALES CALCULATIONS
  // =========================

  const totalBills = billingHistory.length;

  const totalSales = billingHistory.reduce(
    (total, bill) =>
      total + Number(bill.totalAmount || 0),
    0
  );

  const totalSalesItems = billingHistory.reduce(
    (total, bill) =>
      total + Number(bill.totalItems || 0),
    0
  );

  // =========================
  // REPORT CARDS
  // =========================

  const reportCards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: "📦",
      description: `${totalStockUnits} units currently in stock`,
    },
    {
      title: "Total Suppliers",
      value: totalSuppliers,
      icon: "🏢",
      description: "Available suppliers",
    },
    {
      title: "Purchase Orders",
      value: totalPurchaseOrders,
      icon: "🛒",
      description: `${approvedOrders.length} completed orders`,
    },
    {
      title: "Pending Orders",
      value: pendingOrders.length,
      icon: "⏳",
      description: "Orders waiting for approval",
    },
  ];

  // =========================
  // CURRENCY FORMAT
  // =========================

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // =========================
  // AI-STYLE INVENTORY ALERTS
  // =========================

  const getStockMessage = (product) => {
    const stock = Number(product.stock || 0);
    const minStock = Number(product.minStock || 0);

    if (stock === 0) {
      return "Out of stock. Immediate procurement is recommended.";
    }

    if (stock <= minStock) {
      return "Stock is below the recommended level. Consider placing a new order.";
    }

    if (stock <= minStock * 2) {
      return "Stock is approaching the minimum level. Monitor demand closely.";
    }

    return "Current stock level is sufficient.";
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* =========================
          HEADER
      ========================= */}

      <div
        style={{
          marginBottom: "28px",
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            color: "#6366f1",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          BUSINESS ANALYTICS
        </p>

        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "32px",
            color: "#0f172a",
          }}
        >
          📈 Reports & Analytics
        </h1>

        <p
          style={{
            margin: 0,
            color: "#64748b",
          }}
        >
          View inventory, procurement and sales performance.
        </p>
      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {reportCards.map((card) => (
          <div
            key={card.title}
            style={{
              backgroundColor: "#ffffff",
              padding: "22px",
              borderRadius: "16px",
              boxShadow:
                "0 4px 15px rgba(15, 23, 42, 0.07)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "12px",
              }}
            >
              {card.icon}
            </div>

            <p
              style={{
                margin: "0 0 6px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              {card.title}
            </p>

            <h2
              style={{
                margin: "0 0 7px",
                color: "#0f172a",
                fontSize: "28px",
              }}
            >
              {card.value}
            </h2>

            <small
              style={{
                color: "#94a3b8",
              }}
            >
              {card.description}
            </small>
          </div>
        ))}
      </div>

      {/* =========================
          SALES + PURCHASE SUMMARY
      ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        {/* PURCHASE */}

        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "25px",
            borderRadius: "16px",
            boxShadow:
              "0 4px 15px rgba(15, 23, 42, 0.07)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              margin: "0 0 5px",
              color: "#0f172a",
            }}
          >
            💰 Purchase Summary
          </h2>

          <p
            style={{
              color: "#64748b",
              marginTop: "5px",
            }}
          >
            Procurement performance
          </p>

          <div
            style={{
              marginTop: "22px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Total Purchase Value
            </p>

            <h2
              style={{
                margin: "6px 0 20px",
                color: "#0f172a",
              }}
            >
              ₹{formatCurrency(totalPurchaseValue)}
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Completed
                </p>

                <strong
                  style={{
                    fontSize: "22px",
                  }}
                >
                  {approvedOrders.length}
                </strong>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Pending
                </p>

                <strong
                  style={{
                    fontSize: "22px",
                  }}
                >
                  {pendingOrders.length}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* SALES */}

        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "25px",
            borderRadius: "16px",
            boxShadow:
              "0 4px 15px rgba(15, 23, 42, 0.07)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              margin: "0 0 5px",
              color: "#0f172a",
            }}
          >
            🧾 Sales Summary
          </h2>

          <p
            style={{
              color: "#64748b",
              marginTop: "5px",
            }}
          >
            Billing and sales performance
          </p>

          <div
            style={{
              marginTop: "22px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Total Sales
            </p>

            <h2
              style={{
                margin: "6px 0 20px",
                color: "#0f172a",
              }}
            >
              ₹{formatCurrency(totalSales)}
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Total Bills
                </p>

                <strong
                  style={{
                    fontSize: "22px",
                  }}
                >
                  {totalBills}
                </strong>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Items Sold
                </p>

                <strong
                  style={{
                    fontSize: "22px",
                  }}
                >
                  {totalSalesItems}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          INVENTORY STATUS
      ========================= */}

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.07)",
          border: "1px solid #e2e8f0",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            margin: "0 0 6px",
            color: "#0f172a",
          }}
        >
          📦 Inventory Status
        </h2>

        <p
          style={{
            color: "#64748b",
            marginTop: 0,
          }}
        >
          Current stock condition across products
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              padding: "18px",
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
            }}
          >
            <span
              style={{
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Total Stock Units
            </span>

            <h2
              style={{
                margin: "5px 0 0",
              }}
            >
              {totalStockUnits}
            </h2>
          </div>

          <div
            style={{
              padding: "18px",
              backgroundColor: "#fff7ed",
              borderRadius: "12px",
            }}
          >
            <span
              style={{
                color: "#9a3412",
                fontSize: "13px",
              }}
            >
              Low Stock
            </span>

            <h2
              style={{
                margin: "5px 0 0",
              }}
            >
              {lowStockProducts.length}
            </h2>
          </div>

          <div
            style={{
              padding: "18px",
              backgroundColor: "#fef2f2",
              borderRadius: "12px",
            }}
          >
            <span
              style={{
                color: "#b91c1c",
                fontSize: "13px",
              }}
            >
              Out of Stock
            </span>

            <h2
              style={{
                margin: "5px 0 0",
              }}
            >
              {outOfStockProducts.length}
            </h2>
          </div>
        </div>
      </div>

      {/* =========================
          AI PREDICTIONS
      ========================= */}

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.07)",
          border: "1px solid #e2e8f0",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            margin: "0 0 6px",
            color: "#0f172a",
          }}
        >
          🤖 AI Inventory Predictions
        </h2>

        <p
          style={{
            color: "#64748b",
            marginTop: 0,
          }}
        >
          Smart recommendations based on current inventory levels.
        </p>

        {products.length === 0 ? (
          <div
            style={{
              marginTop: "15px",
              padding: "18px",
              backgroundColor: "#f8fafc",
              borderRadius: "10px",
              color: "#64748b",
            }}
          >
            No products available for analysis.
          </div>
        ) : (
          <div
            style={{
              marginTop: "18px",
              display: "grid",
              gap: "10px",
            }}
          >
            {products.map((product) => {
              const stock = Number(product.stock || 0);
              const minStock = Number(product.minStock || 0);

              const needsAttention =
                stock <= minStock;

              return (
                <div
                  key={product.id}
                  style={{
                    padding: "16px",
                    backgroundColor: needsAttention
                      ? "#fff7ed"
                      : "#f8fafc",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <strong>
                    {needsAttention ? "⚠️" : "✅"}{" "}
                    {product.name}
                  </strong>

                  <p
                    style={{
                      margin:
                        "6px 0 0",
                      color: "#64748b",
                    }}
                  >
                    {getStockMessage(product)}
                  </p>

                  <small
                    style={{
                      display: "block",
                      marginTop: "7px",
                      color: "#94a3b8",
                    }}
                  >
                    Current stock: {stock} • Minimum required:{" "}
                    {minStock}
                  </small>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================
          LOW STOCK PRODUCTS
      ========================= */}

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.07)",
          border: "1px solid #e2e8f0",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            margin: "0 0 6px",
          }}
        >
          ⚠️ Products Requiring Attention
        </h2>

        <p
          style={{
            color: "#64748b",
            marginTop: 0,
          }}
        >
          Products at or below their minimum stock level.
        </p>

        {lowStockProducts.length === 0 ? (
          <div
            style={{
              padding: "18px",
              backgroundColor: "#f0fdf4",
              borderRadius: "10px",
              color: "#166534",
              marginTop: "15px",
            }}
          >
            ✅ All products currently have sufficient stock.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              marginTop: "15px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <th style={tableHeaderStyle}>
                    Product
                  </th>

                  <th style={tableHeaderStyle}>
                    Current Stock
                  </th>

                  <th style={tableHeaderStyle}>
                    Minimum Stock
                  </th>

                  <th style={tableHeaderStyle}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {lowStockProducts.map(
                  (product) => {
                    const stock = Number(
                      product.stock || 0
                    );

                    const minStock = Number(
                      product.minStock || 0
                    );

                    return (
                      <tr key={product.id}>
                        <td style={tableCellStyle}>
                          <strong>
                            {product.name}
                          </strong>
                        </td>

                        <td style={tableCellStyle}>
                          {stock}
                        </td>

                        <td style={tableCellStyle}>
                          {minStock}
                        </td>

                        <td style={tableCellStyle}>
                          <span
                            style={{
                              padding:
                                "5px 10px",
                              borderRadius:
                                "20px",
                              backgroundColor:
                                stock === 0
                                  ? "#fee2e2"
                                  : "#ffedd5",
                              color:
                                stock === 0
                                  ? "#b91c1c"
                                  : "#c2410c",
                              fontSize:
                                "12px",
                              fontWeight:
                                "600",
                            }}
                          >
                            {stock === 0
                              ? "Out of Stock"
                              : "Low Stock"}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
          RECENT PURCHASE ORDERS
      ========================= */}

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.07)",
          border: "1px solid #e2e8f0",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            margin: "0 0 6px",
          }}
        >
          🛒 Recent Purchase Orders
        </h2>

        <p
          style={{
            color: "#64748b",
            marginTop: 0,
          }}
        >
          Latest procurement activity.
        </p>

        {purchaseOrders.length === 0 ? (
          <div
            style={{
              padding: "18px",
              backgroundColor: "#f8fafc",
              borderRadius: "10px",
              marginTop: "15px",
              color: "#64748b",
            }}
          >
            No purchase orders available.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              marginTop: "15px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <th style={tableHeaderStyle}>
                    Order
                  </th>

                  <th style={tableHeaderStyle}>
                    Product
                  </th>

                  <th style={tableHeaderStyle}>
                    Quantity
                  </th>

                  <th style={tableHeaderStyle}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {purchaseOrders
                  .slice(0, 8)
                  .map((order) => {
                    const product =
                      products.find(
                        (item) =>
                          Number(item.id) ===
                          Number(
                            order.productId
                          )
                      );

                    return (
                      <tr key={order.id}>
                        <td style={tableCellStyle}>
                          #{order.id}
                        </td>

                        <td style={tableCellStyle}>
                          {product?.name ||
                            order.productName ||
                            "Product"}
                        </td>

                        <td style={tableCellStyle}>
                          {order.quantity || 0}
                        </td>

                        <td style={tableCellStyle}>
                          <span
                            style={{
                              padding:
                                "5px 10px",
                              borderRadius:
                                "20px",
                              backgroundColor:
                                "#dcfce7",
                              color:
                                "#166534",
                              fontSize:
                                "12px",
                              fontWeight:
                                "600",
                            }}
                          >
                            {order.status ||
                              "Completed"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
          RECENT BILLING
      ========================= */}

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.07)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h2
          style={{
            margin: "0 0 6px",
          }}
        >
          🧾 Recent Sales
        </h2>

        <p
          style={{
            color: "#64748b",
            marginTop: 0,
          }}
        >
          Latest generated bills.
        </p>

        {billingHistory.length === 0 ? (
          <div
            style={{
              padding: "18px",
              backgroundColor: "#f8fafc",
              borderRadius: "10px",
              marginTop: "15px",
              color: "#64748b",
            }}
          >
            No sales recorded yet. Generate a bill from the
            Billing page to see sales here.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              marginTop: "15px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <th style={tableHeaderStyle}>
                    Bill Number
                  </th>

                  <th style={tableHeaderStyle}>
                    Date
                  </th>

                  <th style={tableHeaderStyle}>
                    Items
                  </th>

                  <th style={tableHeaderStyle}>
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {billingHistory
                  .slice(0, 8)
                  .map((bill) => (
                    <tr key={bill.id}>
                      <td style={tableCellStyle}>
                        <strong>
                          {bill.billNumber}
                        </strong>
                      </td>

                      <td style={tableCellStyle}>
                        {bill.date}
                      </td>

                      <td style={tableCellStyle}>
                        {bill.totalItems}
                      </td>

                      <td style={tableCellStyle}>
                        <strong>
                          ₹
                          {formatCurrency(
                            bill.totalAmount
                          )}
                        </strong>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================
// TABLE STYLES
// =========================

const tableHeaderStyle = {
  padding: "14px",
  textAlign: "left",
  color: "#475569",
  fontSize: "13px",
  borderBottom: "1px solid #e2e8f0",
};

const tableCellStyle = {
  padding: "14px",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  fontSize: "14px",
};

export default Reports;