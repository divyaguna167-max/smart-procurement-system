import React, { useMemo, useState } from "react";
import { useData } from "./DataContext";
import "./Suppliers.css";

function Suppliers() {
  const { suppliers = [], setSuppliers } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const emptySupplier = {
    name: "",
    contact: "",
    email: "",
    location: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptySupplier);

  /* =========================================
     FILTER
  ========================================= */

  const filteredSuppliers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return suppliers;

    return suppliers.filter((supplier) => {
      return (
        String(supplier.name || "")
          .toLowerCase()
          .includes(search) ||
        String(supplier.location || "")
          .toLowerCase()
          .includes(search) ||
        String(supplier.email || "")
          .toLowerCase()
          .includes(search) ||
        String(supplier.contact || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [suppliers, searchTerm]);

  /* =========================================
     SUMMARY
  ========================================= */

  const totalSuppliers = suppliers.length;

  const activeSuppliers = suppliers.filter(
    (supplier) =>
      String(supplier.status || "").toLowerCase() ===
      "active"
  ).length;

  const inactiveSuppliers = suppliers.filter(
    (supplier) =>
      String(supplier.status || "").toLowerCase() !==
      "active"
  ).length;

  const locations = new Set(
    suppliers
      .map((supplier) => supplier.location)
      .filter(Boolean)
  ).size;

  /* =========================================
     FORM
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     ADD / UPDATE
  ========================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter supplier name.");
      return;
    }

    if (!formData.contact.trim()) {
      alert("Please enter contact number.");
      return;
    }

    if (!formData.location.trim()) {
      alert("Please enter supplier location.");
      return;
    }

    if (editingSupplier) {
      setSuppliers((previous) =>
        previous.map((supplier) =>
          supplier.id === editingSupplier.id
            ? {
                ...supplier,
                ...formData,
                name: formData.name.trim(),
                contact: formData.contact.trim(),
                email: formData.email.trim(),
                location: formData.location.trim(),
              }
            : supplier
        )
      );

      alert("Supplier updated successfully!");
    } else {
      const newSupplier = {
        id: Date.now(),
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        email: formData.email.trim(),
        location: formData.location.trim(),
        status: formData.status,
      };

      setSuppliers((previous) => [
        ...previous,
        newSupplier,
      ]);

      alert("Supplier added successfully!");
    }

    resetForm();
  };

  /* =========================================
     EDIT
  ========================================= */

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);

    setFormData({
      name: supplier.name || "",
      contact: supplier.contact || "",
      email: supplier.email || "",
      location: supplier.location || "",
      status: supplier.status || "Active",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = (id) => {
    const supplier = suppliers.find(
      (item) => item.id === id
    );

    if (!supplier) return;

    const confirmed = window.confirm(
      `Delete "${supplier.name}"?`
    );

    if (!confirmed) return;

    setSuppliers((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  /* =========================================
     RESET
  ========================================= */

  const resetForm = () => {
    setFormData(emptySupplier);
    setEditingSupplier(null);
    setShowForm(false);
  };

  /* =========================================
     STATUS
  ========================================= */

  const getStatusClass = (status) => {
    return String(status || "").toLowerCase() ===
      "active"
      ? "supplier-status-active"
      : "supplier-status-inactive";
  };

  /* =========================================
     JSX
  ========================================= */

  return (
    <div className="suppliers-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="suppliers-page-header">

        <div>
          <p className="suppliers-eyebrow">
            SUPPLIER MANAGEMENT
          </p>

          <h1>
            Suppliers
          </h1>

          <p className="suppliers-description">
            Manage supplier information, contacts
            and procurement partners.
          </p>
        </div>

        <button
          className="suppliers-add-button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          <span>＋</span>
          {showForm ? "Close Form" : "Add Supplier"}
        </button>

      </div>

      {/* =====================================
          SUMMARY
      ===================================== */}

      <div className="suppliers-summary-grid">

        <div className="suppliers-summary-card">

          <div className="suppliers-summary-icon purple">
            🚚
          </div>

          <div>
            <span>Total Suppliers</span>
            <strong>{totalSuppliers}</strong>
            <small>Registered suppliers</small>
          </div>

        </div>

        <div className="suppliers-summary-card">

          <div className="suppliers-summary-icon green">
            ✓
          </div>

          <div>
            <span>Active Suppliers</span>
            <strong>{activeSuppliers}</strong>
            <small>Currently available</small>
          </div>

        </div>

        <div className="suppliers-summary-card">

          <div className="suppliers-summary-icon orange">
            ⏸
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveSuppliers}</strong>
            <small>Not currently active</small>
          </div>

        </div>

        <div className="suppliers-summary-card">

          <div className="suppliers-summary-icon blue">
            📍
          </div>

          <div>
            <span>Locations</span>
            <strong>{locations}</strong>
            <small>Supplier locations</small>
          </div>

        </div>

      </div>

      {/* =====================================
          FORM
      ===================================== */}

      {showForm && (
        <div className="supplier-form-card">

          <div className="supplier-form-header">

            <div>
              <h2>
                {editingSupplier
                  ? "Edit Supplier"
                  : "Add New Supplier"}
              </h2>

              <p>
                {editingSupplier
                  ? "Update supplier information."
                  : "Enter supplier details to add a new procurement partner."}
              </p>
            </div>

            <button
              className="supplier-close-button"
              onClick={resetForm}
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="supplier-form"
          >

            <div className="supplier-form-grid">

              <div className="supplier-form-group">
                <label>
                  Supplier Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter supplier name"
                />
              </div>

              <div className="supplier-form-group">
                <label>
                  Contact Number
                </label>

                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                />
              </div>

              <div className="supplier-form-group">
                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="supplier@email.com"
                />
              </div>

              <div className="supplier-form-group">
                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter city / location"
                />
              </div>

              <div className="supplier-form-group">
                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

            <div className="supplier-form-actions">

              <button
                type="button"
                className="supplier-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="supplier-save-button"
              >
                ✓{" "}
                {editingSupplier
                  ? "Update Supplier"
                  : "Add Supplier"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =====================================
          TABLE
      ===================================== */}

      <div className="suppliers-table-card">

        <div className="suppliers-table-header">

          <div>
            <h2>
              Supplier Directory
            </h2>

            <p>
              View and manage all registered
              suppliers.
            </p>
          </div>

          <div className="suppliers-search-wrapper">

            <span className="suppliers-search-icon">
              🔍
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search suppliers..."
              className="suppliers-search-input"
            />

            {searchTerm && (
              <button
                className="suppliers-search-clear"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}

          </div>

        </div>

        <div className="suppliers-table-wrapper">

          <table className="suppliers-table">

            <thead>

              <tr>
                <th>SUPPLIER</th>
                <th>CONTACT</th>
                <th>EMAIL</th>
                <th>LOCATION</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>

            </thead>

            <tbody>

              {filteredSuppliers.length > 0 ? (

                filteredSuppliers.map((supplier) => (

                  <tr key={supplier.id}>

                    <td>

                      <div className="supplier-name-cell">

                        <div className="supplier-avatar">
                          {String(
                            supplier.name || "S"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {supplier.name}
                          </strong>

                          <span>
                            Supplier ID: {supplier.id}
                          </span>
                        </div>

                      </div>

                    </td>

                    <td>
                      <span className="supplier-contact">
                        {supplier.contact || "Not provided"}
                      </span>
                    </td>

                    <td>
                      <span className="supplier-email">
                        {supplier.email || "Not provided"}
                      </span>
                    </td>

                    <td>
                      <span className="supplier-location">
                        📍 {supplier.location || "Unknown"}
                      </span>
                    </td>

                    <td>

                      <span
                        className={`supplier-status ${getStatusClass(
                          supplier.status
                        )}`}
                      >
                        <span className="supplier-status-dot"></span>
                        {supplier.status || "Inactive"}
                      </span>

                    </td>

                    <td>

                      <div className="supplier-actions">

                        <button
                          className="supplier-edit-button"
                          onClick={() =>
                            handleEdit(supplier)
                          }
                          title="Edit supplier"
                        >
                          ✎
                        </button>

                        <button
                          className="supplier-delete-button"
                          onClick={() =>
                            handleDelete(supplier.id)
                          }
                          title="Delete supplier"
                        >
                          🗑
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="supplier-empty-cell"
                  >

                    <div className="supplier-empty">

                      <div className="supplier-empty-icon">
                        🚚
                      </div>

                      <h3>
                        No suppliers found
                      </h3>

                      <p>
                        {searchTerm
                          ? "Try a different search term."
                          : "Add your first supplier to get started."}
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="suppliers-table-footer">

          <span>
            Showing{" "}
            <strong>
              {filteredSuppliers.length}
            </strong>{" "}
            of{" "}
            <strong>
              {suppliers.length}
            </strong>{" "}
            suppliers
          </span>

          <span>
            Supplier Management
          </span>

        </div>

      </div>

    </div>
  );
}

export default Suppliers;