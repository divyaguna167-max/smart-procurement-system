import React, { useState } from "react";
import "./BusinessType.css";

function BusinessType({ onContinue }) {
  const [selectedBusiness, setSelectedBusiness] = useState("");

  const businesses = [
    {
      id: "supermarket",
      icon: "🏪",
      title: "Supermarket",
      description: "Manage grocery, food and daily products",
    },
    {
      id: "electronics",
      icon: "💻",
      title: "Electronics Shop",
      description: "Manage electronic products and inventory",
    },
    {
      id: "clothing",
      icon: "👕",
      title: "Clothing Store",
      description: "Manage clothing products and stock",
    },
    {
      id: "pharmacy",
      icon: "💊",
      title: "Pharmacy",
      description: "Manage medicines and healthcare products",
    },
    {
      id: "restaurant",
      icon: "🍔",
      title: "Restaurant",
      description: "Manage food supplies and inventory",
    },
    {
      id: "hardware",
      icon: "🔧",
      title: "Hardware Shop",
      description: "Manage tools and hardware products",
    },
    {
      id: "mobile",
      icon: "📱",
      title: "Mobile Shop",
      description: "Manage mobiles and accessories",
    },
    {
      id: "other",
      icon: "🏢",
      title: "Other Business",
      description: "Use SmartProcure for any business",
    },
  ];

  const handleContinue = () => {
    if (!selectedBusiness) {
      alert("Please select your business type");
      return;
    }

    const selected = businesses.find(
      (business) => business.id === selectedBusiness
    );

    onContinue(selected);
  };

  return (
    <div className="business-page">

      <div className="business-container">

        {/* LOGO */}

        <div className="business-brand">

          <div className="business-logo">
            SP
          </div>

          <div>
            <h2>SmartProcure</h2>
            <p>AI MANAGEMENT SYSTEM</p>
          </div>

        </div>


        {/* HEADER */}

        <div className="business-header">

          <div className="business-step">
            STEP 1 OF 1
          </div>

          <h1>Select Your Business Type</h1>

          <p>
            Choose your business category to personalize
            your SmartProcure experience.
          </p>

        </div>


        {/* BUSINESS CARDS */}

        <div className="business-grid">

          {businesses.map((business) => (

            <button
              key={business.id}
              type="button"
              className={`business-card ${
                selectedBusiness === business.id
                  ? "selected-business"
                  : ""
              }`}
              onClick={() =>
                setSelectedBusiness(business.id)
              }
            >

              <div className="business-icon">
                {business.icon}
              </div>

              <div className="business-info">

                <h3>
                  {business.title}
                </h3>

                <p>
                  {business.description}
                </p>

              </div>


              {selectedBusiness === business.id && (

                <div className="business-check">
                  ✓
                </div>

              )}

            </button>

          ))}

        </div>


        {/* CONTINUE */}

        <div className="business-action">

          <button
            type="button"
            className="business-continue"
            onClick={handleContinue}
          >
            Continue to Dashboard →
          </button>

        </div>


        <p className="business-note">
          ✦ You can change your business type later in Settings.
        </p>

      </div>

    </div>
  );
}

export default BusinessType;