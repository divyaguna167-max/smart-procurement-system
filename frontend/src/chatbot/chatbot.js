import React, { useState } from "react";
import "./chatbot.css";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I'm SmartProcure AI Assistant. How can I help you?"
    }
  ]);

  const getBotResponse = (text) => {
    const question = text.toLowerCase().trim();

    // SmartProcure
    if (
      question.includes("what is smartprocure") ||
      question.includes("about smartprocure") ||
      question.includes("what is this system")
    ) {
      return "SmartProcure is an AI-powered procurement and inventory management system that helps businesses manage products, stock, suppliers, billing and purchasing.";
    }

    // Hello / Hi
    if (
      question === "hi" ||
      question === "hello" ||
      question === "hey" ||
      question.includes("good morning") ||
      question.includes("good evening")
    ) {
      return "Hello! 👋 Welcome to SmartProcure AI. I can help you with inventory, procurement, products, billing and AI insights.";
    }

    // Inventory
    if (
      question.includes("inventory") ||
      question.includes("stock") ||
      question.includes("available stock")
    ) {
      return "SmartProcure monitors your inventory and identifies healthy stock, low-stock and out-of-stock products. You can check the Products and Dashboard pages for current stock.";
    }

    // Low stock
    if (
      question.includes("low stock") ||
      question.includes("low-stock")
    ) {
      return "Low stock means the current quantity is below the minimum stock level. SmartProcure identifies these products and recommends purchasing additional units.";
    }

    // Out of stock
    if (
      question.includes("out of stock") ||
      question.includes("out-of-stock")
    ) {
      return "Out-of-stock means the product quantity is currently zero. SmartProcure can identify these products and help you create a purchase order.";
    }

    // Procurement
    if (
      question.includes("procurement") ||
      question.includes("purchase order") ||
      question.includes("purchase")
    ) {
      return "The Procurement module helps you select a supplier, choose a product and create a purchase order. When the order is completed, the stock quantity is updated.";
    }

    // Supplier
    if (
      question.includes("supplier") ||
      question.includes("suppliers")
    ) {
      return "You can manage supplier information from the Suppliers page. SmartProcure stores supplier names, locations and their current status.";
    }

    // Billing
    if (
      question.includes("billing") ||
      question.includes("bill") ||
      question.includes("sales")
    ) {
      return "The Billing module is used to create customer bills. When a bill is completed, the sold quantity is automatically deducted from inventory.";
    }

    // AI
    if (
      question.includes("ai") ||
      question.includes("prediction") ||
      question.includes("demand")
    ) {
      return "SmartProcure uses AI-based demand prediction to analyze sales and inventory information and provide smart procurement recommendations.";
    }

    // AI Insights
    if (
      question.includes("ai insights") ||
      question.includes("recommendation") ||
      question.includes("recommendations")
    ) {
      return "AI Insights analyzes product demand, current stock, minimum stock and market trends to identify products that may need replenishment.";
    }

    // Product
    if (
      question.includes("product") ||
      question.includes("products")
    ) {
      return "You can view and search all available products from the Products page. Product information includes name, price, stock quantity and minimum stock level.";
    }

    // Dashboard
    if (
      question.includes("dashboard") ||
      question.includes("overview")
    ) {
      return "The Dashboard provides an overview of your inventory, total products, current stock, low-stock products and procurement recommendations.";
    }

    // Reports
    if (
      question.includes("report") ||
      question.includes("reports")
    ) {
      return "The Reports section helps you review business and inventory information for better decision-making.";
    }

    // Help
    if (
      question.includes("help") ||
      question.includes("what can you do") ||
      question.includes("commands")
    ) {
      return "I can help with SmartProcure, inventory, low stock, procurement, suppliers, billing, products, dashboard, reports and AI insights. 🤖";
    }

    // Thank you
    if (
      question.includes("thank you") ||
      question.includes("thanks")
    ) {
      return "You're welcome! 😊 I'm always ready to help with SmartProcure.";
    }

    // Bye
    if (
      question === "bye" ||
      question.includes("goodbye")
    ) {
      return "Goodbye! 👋 Have a great day. SmartProcure AI is ready whenever you need help.";
    }

    // Default response
    return "I understand your message, but I don't have a specific answer for that yet. Try asking about inventory, procurement, billing, suppliers, products or AI insights.";
  };


  const sendMessage = () => {
    if (!message.trim()) return;

    const userText = message.trim();

    // User message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText
      }
    ]);

    setMessage("");

    // Different bot response
    setTimeout(() => {
      const response = getBotResponse(userText);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response
        }
      ]);
    }, 400);
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };


  return (
    <>
      {/* CHAT BUTTON */}

      {!open && (
        <button
          className="chatbot-button"
          onClick={() => setOpen(true)}
          aria-label="Open SmartProcure AI Assistant"
        >
          💬
        </button>
      )}


      {/* CHAT WINDOW */}

      {open && (
        <div className="chatbot-container">

          {/* HEADER */}

          <div className="chatbot-header">

            <div className="chatbot-title">

              <div className="chatbot-icon">
                ✦
              </div>

              <div>

                <h3>
                  SmartProcure AI
                </h3>

                <span>
                  <b>●</b> AI Assistant Online
                </span>

              </div>

            </div>


            <button
              className="chatbot-close"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>

          </div>


          {/* MESSAGES */}

          <div className="chatbot-messages">

            {messages.map((item, index) => (

              <div
                key={index}
                className={`chat-message ${item.sender}`}
              >
                {item.text}
              </div>

            ))}

          </div>


          {/* INPUT */}

          <div className="chatbot-input-area">

            <input
              type="text"
              value={message}
              placeholder="Ask about inventory..."
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={sendMessage}
              aria-label="Send message"
            >
              ➤
            </button>

          </div>

        </div>
      )}

    </>
  );
}

export default Chatbot;