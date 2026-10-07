import React, { useMemo, useState } from "react";
import { useData } from "./DataContext";
import "./Products.css";

function Products() {
  const { products = [], setProducts } = useData();

  const [searchTerm, setSearchTerm] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    minStock: "5",
  });

  /* =========================================
     FILTER PRODUCTS
  ========================================= */

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return products;
    }

    return products.filter((product) => {
      const name = String(product.name || "").toLowerCase();
      const category = String(
        product.category || ""
      ).toLowerCase();

      return (
        name.includes(search) ||
        category.includes(search)
      );
    });
  }, [products, searchTerm]);

  /* =========================================
     SUMMARY
  ========================================= */

  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) > 0 &&
      Number(product.stock || 0) <=
        Number(product.minStock || 0)
  ).length;

  const outOfStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) === 0
  ).length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     ADD PRODUCT
  ========================================= */

  const handleAddProduct = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const category = formData.category.trim();

    const price = Number(formData.price);
    const stock = Number(formData.stock);
    const minStock = Number(formData.minStock);

    if (!name || !category) {
      alert("Please enter product name and category.");
      return;
    }

    if (
      Number.isNaN(price) ||
      price <= 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    if (
      Number.isNaN(minStock) ||
      minStock < 0
    ) {
      alert("Please enter a valid minimum stock.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      category,
      price,
      stock,
      minStock,
    };

    setProducts((previousProducts) => [
      ...previousProducts,
      newProduct,
    ]);

    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      minStock: "5",
    });

    setShowAddForm(false);

    alert("Product added successfully!");
  };

  /* =========================================
     DELETE PRODUCT
  ========================================= */

  const handleDeleteProduct = (id) => {
    const product = products.find(
      (item) => item.id === id
    );

    if (!product) return;

    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    );

    if (!confirmed) return;

    setProducts((previousProducts) =>
      previousProducts.filter(
        (item) => item.id !== id
      )
    );
  };

  /* =========================================
     STATUS
  ========================================= */

  const getProductStatus = (product) => {
    const stock = Number(product.stock || 0);
    const minStock = Number(product.minStock || 0);

    if (stock === 0) {
      return {
        label: "Out of Stock",
        className: "status-out",
      };
    }

    if (stock <= minStock) {
      return {
        label: "Low Stock",
        className: "status-low",
      };
    }

    return {
      label: "In Stock",
      className: "status-in",
    };
  };

  /* =========================================
     CURRENCY
  ========================================= */

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  /* =========================================
     JSX
  ========================================= */

  return (
    <div className="products-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="products-page-header">

        <div>
          <p className="products-eyebrow">
            INVENTORY MANAGEMENT
          </p>

          <h1>
            Products
          </h1>

          <p className="products-description">
            Manage products, stock levels and
            inventory information from one place.
          </p>
        </div>

        <button
          className="products-add-main-button"
          onClick={() =>
            setShowAddForm((previous) => !previous)
          }
        >
          <span>＋</span>
          Add Product
        </button>

      </div>

      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="products-summary-grid">

        <div className="products-summary-card">

          <div className="products-summary-icon purple">
            📦
          </div>

          <div>
            <span>Total Products</span>
            <strong>{totalProducts}</strong>
            <small>Products registered</small>
          </div>

        </div>

        <div className="products-summary-card">

          <div className="products-summary-icon blue">
            📊
          </div>

          <div>
            <span>Total Stock</span>
            <strong>{totalStock}</strong>
            <small>Available units</small>
          </div>

        </div>

        <div className="products-summary-card">

          <div className="products-summary-icon orange">
            ⚠️
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{lowStockProducts}</strong>
            <small>Need attention</small>
          </div>

        </div>

        <div className="products-summary-card">

          <div className="products-summary-icon red">
            🚨
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>{outOfStockProducts}</strong>
            <small>Immediate action</small>
          </div>

        </div>

      </div>

      {/* =====================================
          ADD PRODUCT FORM
      ===================================== */}

      {showAddForm && (
        <div className="products-form-card">

          <div className="products-form-header">

            <div>
              <h2>
                Add New Product
              </h2>

              <p>
                Enter product details to add it
                to your inventory.
              </p>
            </div>

            <button
              className="products-form-close"
              onClick={() => setShowAddForm(false)}
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleAddProduct}
            className="products-form"
          >

            <div className="products-form-grid">

              <div className="products-form-group">
                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
              </div>

              <div className="products-form-group">
                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                />
              </div>

              <div className="products-form-group">
                <label>
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                />
              </div>

              <div className="products-form-group">
                <label>
                  Initial Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock"
                  min="0"
                />
              </div>

              <div className="products-form-group">
                <label>
                  Minimum Stock
                </label>

                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  placeholder="Minimum stock level"
                  min="0"
                />
              </div>

            </div>

            <div className="products-form-actions">

              <button
                type="button"
                className="products-cancel-button"
                onClick={() =>
                  setShowAddForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="products-save-button"
              >
                ✓ Add Product
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =====================================
          PRODUCTS TABLE CARD
      ===================================== */}

      <div className="products-table-card">

        <div className="products-table-header">

          <div>
            <h2>
              Product Inventory
            </h2>

            <p>
              View and manage all products
              in your inventory.
            </p>
          </div>

          <div className="products-search-wrapper">

            <span className="products-search-icon">
              🔍
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search products..."
              className="products-search-input"
            />

            {searchTerm && (
              <button
                className="products-search-clear"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}

          </div>

        </div>

        {/* =====================================
            TABLE
        ===================================== */}

        <div className="products-table-wrapper">

          <table className="products-table">

            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>MIN. STOCK</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.length > 0 ? (

                filteredProducts.map((product) => {

                  const status =
                    getProductStatus(product);

                  return (
                    <tr key={product.id}>

                      <td>
                        <div className="product-name-cell">

                          <div className="product-avatar">
                            {String(
                              product.name || "P"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {product.name}
                            </strong>

                            <span>
                              ID: {product.id}
                            </span>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="product-category-badge">
                          {product.category ||
                            "General"}
                        </span>
                      </td>

                      <td>
                        <strong className="product-price">
                          {formatCurrency(
                            product.price
                          )}
                        </strong>
                      </td>

                      <td>
                        <div
                          className={`product-stock ${
                            status.className
                          }`}
                        >
                          <strong>
                            {product.stock}
                          </strong>

                          <span>
                            units
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="product-min-stock">
                          {product.minStock}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`product-status ${status.className}`}
                        >
                          <span className="status-dot"></span>
                          {status.label}
                        </span>
                      </td>

                      <td>

                        <button
                          className="product-delete-button"
                          onClick={() =>
                            handleDeleteProduct(
                              product.id
                            )
                          }
                          title="Delete product"
                        >
                          🗑
                        </button>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td
                    colSpan="7"
                    className="products-empty-cell"
                  >

                    <div className="products-empty">

                      <div className="products-empty-icon">
                        📦
                      </div>

                      <h3>
                        No products found
                      </h3>

                      <p>
                        {searchTerm
                          ? "Try a different search term."
                          : "Add your first product to get started."}
                      </p>

                    </div>

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =====================================
            TABLE FOOTER
        ===================================== */}

        <div className="products-table-footer">

          <span>
            Showing{" "}
            <strong>
              {filteredProducts.length}
            </strong>{" "}
            of{" "}
            <strong>
              {products.length}
            </strong>{" "}
            products
          </span>

          <span>
            Inventory Management
          </span>

        </div>

      </div>

    </div>
  );
}

export default Products;