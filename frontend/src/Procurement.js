import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "./DataContext";

function Procurement() {
  const {
    products = [],
    suppliers = [],
    purchaseOrders = [],
    createPurchaseOrder,
  } = useData();

  const [searchParams] = useSearchParams();

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [supplierId, setSupplierId] = useState("");
  const [quantity, setQuantity] = useState("");

  // =========================================
  // LOW STOCK PRODUCTS
  // =========================================

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) <= Number(product.minStock)
  );

  // =========================================
  // OPEN MODAL
  // =========================================

  const openModal = (product) => {
    setSelectedProduct(product);
    setSupplierId("");
    setQuantity("");
    setShowModal(true);
  };

  // =========================================
  // AI RECOMMENDATION AUTO OPEN
  // =========================================

  useEffect(() => {
    const productId = searchParams.get("product");
    const aiQuantity = searchParams.get("quantity");

    if (
      !productId ||
      !aiQuantity ||
      !products.length
    ) {
      return;
    }

    const product = products.find(
      (item) =>
        String(item.id) === String(productId)
    );

    if (!product) {
      return;
    }

    setSelectedProduct(product);
    setSupplierId("");
    setQuantity(aiQuantity);
    setShowModal(true);
  }, [searchParams, products]);

  // =========================================
  // CLOSE MODAL
  // =========================================

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSupplierId("");
    setQuantity("");
  };

  // =========================================
  // CREATE ORDER
  // =========================================

  const handleCreateOrder = () => {
    if (!supplierId) {
      alert("Please select a supplier");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (!selectedProduct) {
      return;
    }

    const success = createPurchaseOrder(
      supplierId,
      selectedProduct.id,
      quantity
    );

    if (success) {
      alert(
        "Purchase Order Created Successfully!"
      );

      closeModal();
    } else {
      alert(
        "Unable to create purchase order"
      );
    }
  };

  return (
    <div
      style={{
        padding: "35px",
        maxWidth: "1500px",
        margin: "0 auto",
      }}
    >

      {/* =====================================
          HEADER
      ===================================== */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <p
          style={{
            color: "#6366f1",
            fontWeight: "700",
            fontSize: "12px",
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          PROCUREMENT MANAGEMENT
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                color: "#1e293b",
              }}
            >
              Procurement
            </h1>

            <p
              style={{
                color: "#64748b",
                marginTop: "8px",
                fontSize: "16px",
              }}
            >
              Manage stock requirements and purchase
              orders efficiently.
            </p>
          </div>

          <div
            style={{
              background: "#eef2ff",
              padding: "14px 20px",
              borderRadius: "12px",
              color: "#4f46e5",
              fontWeight: "600",
            }}
          >
            📦 {lowStockProducts.length} Items
            Need Attention
          </div>
        </div>
      </div>

      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >

        {/* LOW STOCK */}

        <div
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "16px",
            boxShadow:
              "0 4px 20px rgba(15, 23, 42, 0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              color: "#64748b",
              margin: 0,
              fontSize: "14px",
            }}
          >
            Low Stock Items
          </p>

          <h2
            style={{
              margin: "10px 0",
              fontSize: "32px",
              color:
                lowStockProducts.length > 0
                  ? "#ef4444"
                  : "#22c55e",
            }}
          >
            {lowStockProducts.length}
          </h2>

          <span
            style={{
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            Requires procurement
          </span>
        </div>

        {/* TOTAL PRODUCTS */}

        <div
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "16px",
            boxShadow:
              "0 4px 20px rgba(15, 23, 42, 0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              color: "#64748b",
              margin: 0,
              fontSize: "14px",
            }}
          >
            Total Products
          </p>

          <h2
            style={{
              margin: "10px 0",
              fontSize: "32px",
              color: "#1e293b",
            }}
          >
            {products.length}
          </h2>

          <span
            style={{
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            Active inventory products
          </span>
        </div>

        {/* SUPPLIERS */}

        <div
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "16px",
            boxShadow:
              "0 4px 20px rgba(15, 23, 42, 0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              color: "#64748b",
              margin: 0,
              fontSize: "14px",
            }}
          >
            Active Suppliers
          </p>

          <h2
            style={{
              margin: "10px 0",
              fontSize: "32px",
              color: "#1e293b",
            }}
          >
            {
              suppliers.filter(
                (supplier) =>
                  supplier.status === "Active"
              ).length
            }
          </h2>

          <span
            style={{
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            Available suppliers
          </span>
        </div>

        {/* PURCHASE ORDERS */}

        <div
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "16px",
            boxShadow:
              "0 4px 20px rgba(15, 23, 42, 0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              color: "#64748b",
              margin: 0,
              fontSize: "14px",
            }}
          >
            Purchase Orders
          </p>

          <h2
            style={{
              margin: "10px 0",
              fontSize: "32px",
              color: "#4f46e5",
            }}
          >
            {purchaseOrders.length}
          </h2>

          <span
            style={{
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            Total orders created
          </span>
        </div>
      </div>

      {/* =====================================
          LOW STOCK SECTION
      ===================================== */}

      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "28px",
          boxShadow:
            "0 4px 20px rgba(15, 23, 42, 0.06)",
          border: "1px solid #e2e8f0",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#1e293b",
              }}
            >
              Products Requiring Procurement
            </h2>

            <p
              style={{
                color: "#64748b",
                marginTop: "7px",
              }}
            >
              Products currently below their minimum
              stock level.
            </p>
          </div>

          <span
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              padding: "8px 14px",
              borderRadius: "20px",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            {lowStockProducts.length} Low Stock
          </span>
        </div>

        {lowStockProducts.length === 0 ? (

          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
              background: "#f8fafc",
              borderRadius: "14px",
            }}
          >
            <div
              style={{
                fontSize: "45px",
              }}
            >
              🎉
            </div>

            <h3
              style={{
                color: "#22c55e",
                marginBottom: "8px",
              }}
            >
              Inventory is Healthy
            </h3>

            <p
              style={{
                color: "#64748b",
              }}
            >
              All products currently have sufficient
              stock.
            </p>
          </div>

        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >

            {lowStockProducts.map((product) => {

              const shortage =
                Number(product.minStock) -
                Number(product.stock);

              return (

                <div
                  key={product.id}
                  style={{
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "15px",
                    padding: "22px",
                    transition: "0.3s",
                    background: "#ffffff",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                      }}
                    >

                      <div
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "12px",
                          background: "#eef2ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",
                          fontSize: "22px",
                        }}
                      >
                        📦
                      </div>

                      <div>

                        <h3
                          style={{
                            margin: 0,
                            color:
                              "#1e293b",
                          }}
                        >
                          {product.name}
                        </h3>

                        <p
                          style={{
                            color:
                              "#64748b",
                            margin:
                              "5px 0 0",
                            fontSize:
                              "13px",
                          }}
                        >
                          {product.category}
                        </p>

                      </div>

                    </div>

                    <span
                      style={{
                        background:
                          "#fef2f2",
                        color:
                          "#dc2626",
                        padding:
                          "6px 10px",
                        borderRadius:
                          "15px",
                        fontSize:
                          "12px",
                        fontWeight:
                          "600",
                      }}
                    >
                      Low Stock
                    </span>

                  </div>

                  <div
                    style={{
                      marginTop: "22px",
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "12px",
                    }}
                  >

                    <div
                      style={{
                        background:
                          "#f8fafc",
                        padding:
                          "12px",
                        borderRadius:
                          "10px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color:
                            "#64748b",
                          fontSize:
                            "12px",
                        }}
                      >
                        Current Stock
                      </p>

                      <strong
                        style={{
                          color:
                            "#ef4444",
                          fontSize:
                            "20px",
                        }}
                      >
                        {product.stock}
                      </strong>
                    </div>

                    <div
                      style={{
                        background:
                          "#f8fafc",
                        padding:
                          "12px",
                        borderRadius:
                          "10px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color:
                            "#64748b",
                          fontSize:
                            "12px",
                        }}
                      >
                        Minimum Level
                      </p>

                      <strong
                        style={{
                          color:
                            "#1e293b",
                          fontSize:
                            "20px",
                        }}
                      >
                        {product.minStock}
                      </strong>
                    </div>

                  </div>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      marginTop: "15px",
                    }}
                  >
                    Recommended quantity shortage:{" "}

                    <strong
                      style={{
                        color: "#ef4444",
                      }}
                    >
                      {shortage > 0
                        ? shortage
                        : 0}{" "}
                      units
                    </strong>
                  </p>

                  <button
                    onClick={() =>
                      openModal(product)
                    }
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      padding: "12px",
                      background:
                        "linear-gradient(135deg, #4f46e5, #6366f1)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Create Purchase Order →
                  </button>

                </div>

              );
            })}

          </div>

        )}

      </div>

      {/* =====================================
          RECENT PURCHASE ORDERS
      ===================================== */}

      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "28px",
          boxShadow:
            "0 4px 20px rgba(15, 23, 42, 0.06)",
          border: "1px solid #e2e8f0",
        }}
      >

        <div
          style={{
            marginBottom: "22px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#1e293b",
            }}
          >
            Recent Purchase Orders
          </h2>

          <p
            style={{
              color: "#64748b",
              marginTop: "7px",
            }}
          >
            Track your latest procurement activity.
          </p>
        </div>

        {purchaseOrders.length === 0 ? (

          <div
            style={{
              textAlign: "center",
              padding: "45px",
              background: "#f8fafc",
              borderRadius: "14px",
            }}
          >

            <div
              style={{
                fontSize: "40px",
              }}
            >
              📋
            </div>

            <h3
              style={{
                color: "#334155",
              }}
            >
              No Purchase Orders Yet
            </h3>

            <p
              style={{
                color: "#64748b",
              }}
            >
              Your recent procurement orders will
              appear here.
            </p>

          </div>

        ) : (

          <div
            style={{
              overflowX: "auto",
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >

              <thead>

                <tr
                  style={{
                    background:
                      "#f8fafc",
                  }}
                >

                  <th
                    style={{
                      padding: "15px",
                      textAlign: "left",
                      color:
                        "#64748b",
                      fontSize:
                        "13px",
                    }}
                  >
                    Product
                  </th>

                  <th
                    style={{
                      padding: "15px",
                      textAlign: "left",
                      color:
                        "#64748b",
                      fontSize:
                        "13px",
                    }}
                  >
                    Supplier
                  </th>

                  <th
                    style={{
                      padding: "15px",
                      textAlign: "left",
                      color:
                        "#64748b",
                      fontSize:
                        "13px",
                    }}
                  >
                    Quantity
                  </th>

                  <th
                    style={{
                      padding: "15px",
                      textAlign: "left",
                      color:
                        "#64748b",
                      fontSize:
                        "13px",
                    }}
                  >
                    Date
                  </th>

                  <th
                    style={{
                      padding: "15px",
                      textAlign: "left",
                      color:
                        "#64748b",
                      fontSize:
                        "13px",
                    }}
                  >
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {purchaseOrders.map(
                  (order) => (

                    <tr
                      key={order.id}
                      style={{
                        borderBottom:
                          "1px solid #e2e8f0",
                      }}
                    >

                      <td
                        style={{
                          padding: "16px",
                          fontWeight:
                            "600",
                          color:
                            "#1e293b",
                        }}
                      >
                        📦{" "}
                        {order.productName}
                      </td>

                      <td
                        style={{
                          padding: "16px",
                          color:
                            "#475569",
                        }}
                      >
                        {order.supplierName}
                      </td>

                      <td
                        style={{
                          padding: "16px",
                          color:
                            "#475569",
                        }}
                      >
                        {order.quantity} Units
                      </td>

                      <td
                        style={{
                          padding: "16px",
                          color:
                            "#64748b",
                        }}
                      >
                        {order.date}
                      </td>

                      <td
                        style={{
                          padding: "16px",
                        }}
                      >

                        <span
                          style={{
                            background:
                              "#dcfce7",
                            color:
                              "#16a34a",
                            padding:
                              "6px 12px",
                            borderRadius:
                              "20px",
                            fontSize:
                              "12px",
                            fontWeight:
                              "600",
                          }}
                        >
                          {order.status}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =====================================
          PURCHASE ORDER MODAL
      ===================================== */}

      {showModal && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "rgba(15, 23, 42, 0.55)",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >

          <div
            style={{
              background: "white",
              width: "100%",
              maxWidth: "450px",
              borderRadius: "20px",
              padding: "30px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >

            {/* MODAL HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "25px",
              }}
            >

              <div>

                <p
                  style={{
                    color: "#6366f1",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing:
                      "1px",
                    margin: 0,
                  }}
                >
                  PROCUREMENT
                </p>

                <h2
                  style={{
                    margin:
                      "5px 0 0",
                    color:
                      "#1e293b",
                  }}
                >
                  Create Purchase Order
                </h2>

              </div>

              <button
                onClick={closeModal}
                style={{
                  border: "none",
                  background:
                    "#f1f5f9",
                  width: "35px",
                  height: "35px",
                  borderRadius:
                    "50%",
                  cursor:
                    "pointer",
                  fontSize:
                    "18px",
                }}
              >
                ×
              </button>

            </div>

            {/* SELECTED PRODUCT */}

            <div
              style={{
                background:
                  "#eef2ff",
                padding:
                  "16px",
                borderRadius:
                  "12px",
                marginBottom:
                  "20px",
              }}
            >

              <p
                style={{
                  margin: 0,
                  color:
                    "#64748b",
                  fontSize:
                    "12px",
                }}
              >
                Selected Product
              </p>

              <strong
                style={{
                  color:
                    "#312e81",
                  fontSize:
                    "18px",
                }}
              >
                📦{" "}
                {selectedProduct?.name}
              </strong>

            </div>

            {/* SUPPLIER */}

            <label
              style={{
                fontWeight:
                  "600",
                color:
                  "#334155",
              }}
            >
              Select Supplier
            </label>

            <select
              value={supplierId}
              onChange={(e) =>
                setSupplierId(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding:
                  "13px",
                marginTop:
                  "8px",
                marginBottom:
                  "20px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #cbd5e1",
                fontSize:
                  "14px",
              }}
            >

              <option value="">
                Choose a supplier
              </option>

              {suppliers
                .filter(
                  (supplier) =>
                    supplier.status ===
                    "Active"
                )
                .map(
                  (supplier) => (

                    <option
                      key={
                        supplier.id
                      }
                      value={
                        supplier.id
                      }
                    >
                      {
                        supplier.name
                      }
                    </option>

                  )
                )}

            </select>

            {/* QUANTITY */}

            <label
              style={{
                fontWeight:
                  "600",
                color:
                  "#334155",
              }}
            >
              Order Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              placeholder="Enter quantity"
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding:
                  "13px",
                marginTop:
                  "8px",
                marginBottom:
                  "25px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #cbd5e1",
                boxSizing:
                  "border-box",
                fontSize:
                  "14px",
              }}
            />

            {/* AI INFO */}

            {searchParams.get(
              "quantity"
            ) && (

              <div
                style={{
                  background:
                    "#f0fdf4",
                  border:
                    "1px solid #bbf7d0",
                  color:
                    "#166534",
                  padding:
                    "10px 12px",
                  borderRadius:
                    "9px",
                  marginBottom:
                    "18px",
                  fontSize:
                    "12px",
                }}
              >
                ✨ AI Recommended Quantity:
                {" "}
                <strong>
                  {
                    searchParams.get(
                      "quantity"
                    )
                  }{" "}
                  units
                </strong>
              </div>

            )}

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >

              <button
                onClick={closeModal}
                style={{
                  flex: 1,
                  padding:
                    "13px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #cbd5e1",
                  background:
                    "white",
                  cursor:
                    "pointer",
                  fontWeight:
                    "600",
                }}
              >
                Cancel
              </button>

              <button
                onClick={
                  handleCreateOrder
                }
                style={{
                  flex: 1,
                  padding:
                    "13px",
                  borderRadius:
                    "10px",
                  border:
                    "none",
                  background:
                    "linear-gradient(135deg, #4f46e5, #6366f1)",
                  color:
                    "white",
                  cursor:
                    "pointer",
                  fontWeight:
                    "600",
                }}
              >
                Create Order
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Procurement;