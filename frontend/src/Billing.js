import React, { useState } from "react";
import { useData } from "./DataContext";
import "./Billing.css";

function Billing() {
  const {
    products,
    setProducts,
    billingHistory,
    setBillingHistory,
  } = useData();

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  const selectedProductData = products.find(
    (product) => String(product.id) === String(selectedProduct)
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.05;
  const totalAmount = subtotal + tax;

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleAddToCart = () => {
    if (!selectedProductData) {
      alert("Please select a product.");
      return;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const existingCartItem = cart.find(
      (item) => item.productId === selectedProductData.id
    );

    const alreadyInCart = existingCartItem
      ? existingCartItem.quantity
      : 0;

    if (alreadyInCart + qty > Number(selectedProductData.stock)) {
      alert(
        `Only ${selectedProductData.stock} units available for ${selectedProductData.name}.`
      );
      return;
    }

    if (existingCartItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === selectedProductData.id
            ? {
                ...item,
                quantity: item.quantity + qty,
              }
            : item
        )
      );
    } else {
      setCart((prevCart) => [
        ...prevCart,
        {
          productId: selectedProductData.id,
          name: selectedProductData.name,
          category: selectedProductData.category,
          price: Number(selectedProductData.price),
          quantity: qty,
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const handleGenerateBill = () => {
    if (cart.length === 0) {
      alert("Please add at least one product to the cart.");
      return;
    }

    // Final stock validation
    for (const item of cart) {
      const product = products.find(
        (p) => p.id === item.productId
      );

      if (!product) {
        alert(`${item.name} is no longer available.`);
        return;
      }

      if (Number(item.quantity) > Number(product.stock)) {
        alert(
          `Insufficient stock for ${item.name}. Available stock: ${product.stock}`
        );
        return;
      }
    }

    // Reduce stock
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const cartItem = cart.find(
          (item) => item.productId === product.id
        );

        if (!cartItem) {
          return product;
        }

        return {
          ...product,
          stock:
            Number(product.stock) -
            Number(cartItem.quantity),
        };
      })
    );

    const now = new Date();

    const bill = {
      id: Date.now(),
      billNumber: `INV-${String(Date.now()).slice(-6)}`,
      date: now.toLocaleDateString("en-IN"),
      time: now.toLocaleTimeString("en-IN"),
      items: cart.map((item) => ({
        ...item,
      })),
      totalItems,
      subtotal,
      tax,
      totalAmount,
    };

    setBillingHistory((prevHistory) => [
      bill,
      ...prevHistory,
    ]);

    alert(
      `Bill ${bill.billNumber} generated successfully!`
    );

    setCart([]);
    setSelectedProduct("");
    setQuantity(1);
  };

  const handleDeleteBill = (billId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bill?"
    );

    if (!confirmDelete) {
      return;
    }

    setBillingHistory((prevHistory) =>
      prevHistory.filter((bill) => bill.id !== billId)
    );

    if (selectedBill?.id === billId) {
      setSelectedBill(null);
    }
  };

  return (
    <div className="billing-page">

      {/* ================= HEADER ================= */}
      <div className="page-header billing-page-header">

        <div>
          <div className="page-eyebrow">
            <span>⚡</span>
            BILLING & SALES
          </div>

          <h1>Billing</h1>

          <p className="page-description">
            Create invoices, manage customer billing and
            track sales in real time.
          </p>
        </div>

        <div className="billing-header-badge">
          <span>●</span>
          Live Billing
        </div>

      </div>

      {/* ================= MAIN BILLING AREA ================= */}
      <div className="billing-grid">

        {/* ================= LEFT CARD ================= */}
        <div className="billing-main-card">

          <div className="billing-card-header">
            <div>
              <h2>Create New Invoice</h2>

              <p>
                Select products and add them to the invoice.
              </p>
            </div>

            <div className="billing-header-icon">
              🧾
            </div>
          </div>

          {/* PRODUCT SELECTION */}
          <div className="billing-product-section">

            <div className="billing-form-group">
              <label>Select Product</label>

              <select
                value={selectedProduct}
                onChange={(e) =>
                  setSelectedProduct(e.target.value)
                }
              >
                <option value="">
                  Choose a product
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                    disabled={Number(product.stock) <= 0}
                  >
                    {product.name} — ₹
                    {Number(product.price).toLocaleString(
                      "en-IN"
                    )}{" "}
                    | Stock: {product.stock}
                  </option>
                ))}
              </select>

              {selectedProductData && (
                <div className="selected-product-info">
                  <span>
                    Available Stock
                  </span>

                  <strong>
                    {selectedProductData.stock} units
                  </strong>
                </div>
              )}
            </div>

            <div className="billing-form-group quantity-group">
              <label>Quantity</label>

              <input
                type="number"
                min="1"
                max={
                  selectedProductData
                    ? selectedProductData.stock
                    : undefined
                }
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />

              <button
                type="button"
                className="add-cart-button"
                onClick={handleAddToCart}
              >
                + Add
              </button>
            </div>

          </div>

          {/* ================= CART ================= */}
          <div className="cart-section">

            <div className="cart-title">
              <span>🛒</span>

              <span>Current Cart</span>

              <span className="cart-count">
                {totalItems}
              </span>
            </div>

            {cart.length === 0 ? (

              <div className="empty-cart">

                <div className="empty-cart-icon">
                  🛒
                </div>

                <strong>
                  Your cart is empty
                </strong>

                <p>
                  Select a product above to start billing.
                </p>

              </div>

            ) : (

              <div className="cart-items">

                {cart.map((item) => (

                  <div
                    className="cart-item"
                    key={item.productId}
                  >

                    <div className="cart-product-info">

                      <div className="cart-product-icon">
                        📦
                      </div>

                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.category || "Product"}
                        </span>
                      </div>

                    </div>

                    <div className="cart-item-right">

                      <div className="cart-price-info">
                        <strong>
                          {item.quantity} × ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <span>
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveFromCart(
                            item.productId
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* ================= BILL SUMMARY ================= */}
        <div className="bill-summary-card">

          <div className="bill-summary-header">

            <div className="invoice-icon">
              🧾
            </div>

            <div>
              <h2>Invoice Summary</h2>

              <span>
                Current billing amount
              </span>
            </div>

          </div>

          <hr className="summary-divider" />

          <div className="invoice-row">
            <span>Items</span>

            <strong>
              {totalItems}
            </strong>
          </div>

          <div className="invoice-row">
            <span>Subtotal</span>

            <strong>
              ₹
              {subtotal.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </strong>
          </div>

          <div className="invoice-row">
            <span>Tax (5%)</span>

            <strong>
              ₹
              {tax.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </strong>
          </div>

          <div className="invoice-total">

            <span>Total</span>

            <span>
              ₹
              {totalAmount.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </span>

          </div>

          <button
            type="button"
            className="generate-bill-button"
            onClick={handleGenerateBill}
            disabled={cart.length === 0}
          >
            ✓ Generate Invoice
          </button>

          <div className="secure-billing-note">
            🔒 Stock will be automatically updated
            after invoice generation.
          </div>

        </div>

      </div>

      {/* ================= BILLING HISTORY ================= */}
      <div className="billing-history-card">

        <div className="billing-history-header">

          <div>
            <h2>Billing History</h2>

            <p>
              Recent invoices and sales transactions
            </p>
          </div>

          <span className="history-count">
            {billingHistory.length} Bills
          </span>

        </div>

        {billingHistory.length === 0 ? (

          <div className="empty-history">
            <div>
              <span className="history-empty-icon">
                🧾
              </span>

              <strong>
                No billing history yet
              </strong>

              <p>
                Generated invoices will appear here.
              </p>
            </div>
          </div>

        ) : (

          <div className="billing-history-table-wrapper">

            <table className="billing-history-table">

              <thead>
                <tr>
                  <th>Bill Number</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Subtotal</th>
                  <th>Tax</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {billingHistory.map((bill) => (

                  <tr key={bill.id}>

                    <td>
                      <strong className="bill-number">
                        {bill.billNumber}
                      </strong>
                    </td>

                    <td>
                      <div>
                        {bill.date}
                      </div>

                      <span className="bill-time">
                        {bill.time}
                      </span>
                    </td>

                    <td>
                      <span className="items-badge">
                        {bill.totalItems}
                      </span>
                    </td>

                    <td>
                      ₹
                      {Number(
                        bill.subtotal
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td>
                      ₹
                      {Number(
                        bill.tax
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td>
                      <strong className="bill-total">
                        ₹
                        {Number(
                          bill.totalAmount
                        ).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </strong>
                    </td>

                    <td>

                      <div className="bill-actions">

                        <button
                          type="button"
                          className="view-bill-button"
                          onClick={() =>
                            setSelectedBill(bill)
                          }
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="delete-bill-button"
                          onClick={() =>
                            handleDeleteBill(
                              bill.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ================= INFO CARDS ================= */}
      <div className="billing-info-grid">

        <div className="billing-info-card">

          <div className="info-icon">
            ⚡
          </div>

          <h3>
            Fast Billing
          </h3>

          <p>
            Create invoices quickly with
            real-time product availability.
          </p>

        </div>

        <div className="billing-info-card">

          <div className="info-icon">
            📦
          </div>

          <h3>
            Live Inventory
          </h3>

          <p>
            Product stock updates automatically
            after bill generation.
          </p>

        </div>

        <div className="billing-info-card">

          <div className="info-icon">
            📊
          </div>

          <h3>
            Sales Tracking
          </h3>

          <p>
            Monitor billing activity and
            sales performance.
          </p>

        </div>

      </div>

      {/* ================= BILL MODAL ================= */}
      {selectedBill && (

        <div
          className="bill-modal-overlay"
          onClick={() => setSelectedBill(null)}
        >

          <div
            className="bill-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="bill-modal-header">

              <div>
                <span className="modal-eyebrow">
                  INVOICE
                </span>

                <h2>
                  {selectedBill.billNumber}
                </h2>
              </div>

              <button
                type="button"
                className="close-bill-modal"
                onClick={() =>
                  setSelectedBill(null)
                }
              >
                ×
              </button>

            </div>

            <div className="modal-bill-meta">

              <div>
                <span>Date</span>
                <strong>
                  {selectedBill.date}
                </strong>
              </div>

              <div>
                <span>Time</span>
                <strong>
                  {selectedBill.time}
                </strong>
              </div>

            </div>

            <div className="bill-modal-items">

              {selectedBill.items.map(
                (item, index) => (

                  <div
                    className="bill-modal-item"
                    key={`${item.productId}-${index}`}
                  >

                    <div>
                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {item.quantity} × ₹
                        {Number(
                          item.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    <strong>
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                )
              )}

            </div>

            <div className="bill-modal-summary">

              <div className="invoice-row">
                <span>Subtotal</span>

                <strong>
                  ₹
                  {Number(
                    selectedBill.subtotal
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </strong>
              </div>

              <div className="invoice-row">
                <span>Tax</span>

                <strong>
                  ₹
                  {Number(
                    selectedBill.tax
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </strong>
              </div>

              <div className="modal-final-total">

                <span>
                  Grand Total
                </span>

                <span>
                  ₹
                  {Number(
                    selectedBill.totalAmount
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Billing;