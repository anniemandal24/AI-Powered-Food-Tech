import "./Hero.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { inventoryService } from "../../services/inventoryServices";

export default function Hero() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // 🔐 Check login before fetching inventory
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token || token === "undefined" || token === "null") return;

    const fetchHeroData = async () => {
      try {
        const data = await inventoryService.getAllItems();

        const activeItems = data
          .filter((i) => i.status === "AVAILABLE")
          .slice(0, 4);

        setItems(activeItems);
      } catch (err) {
        console.error("Hero inventory fetch failed:", err);
      }
    };

    fetchHeroData();
  }, []);

  // 🔐 Navigate with auth check
  const handleProtectedNavigation = (path) => {
    const token = localStorage.getItem("accessToken");

    if (token && token !== "undefined" && token !== "null") {
      navigate(path);
    } else {
      navigate("/login-signup", { state: { from: path } });
    }
  };

  const getExpiryText = (date) => {
    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) return "Expired";
    return `${days} days left`;
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>

      {/* LEFT */}
      <div className="hero-content">
        <div className="hero-badge">🌱 Smart Kitchen Assistant</div>

        <h1>
          Stop Wasting Food.
          <br />
          <span className="hero-badge-spn">Start Eating</span>
          <br />
          Smarter.
        </h1>

        <p>
          Track your groceries and expiry dates. Get smart suggestions before food goes bad.
        </p>

        <div className="hero-btns">
          <button
            className="btn-primary"
            onClick={() => handleProtectedNavigation("/inventory")}
          >
            📦 View My Fridge
          </button>

          <button
            className="btn-secondary"
            onClick={() => handleProtectedNavigation("/chat")}
          >
            💬 AI Chat
          </button>
        </div>
      </div>

      {/* RIGHT (CLICKABLE CARD) */}
      <div className="hero-visual">
        <div
          className="fridge-card clickable"
          onClick={() => handleProtectedNavigation("/inventory")}
        >
          <div className="fridge-header">
            <span className="fridge-title">My Fridge 🧊</span>
            <span className="scan-badge">● LIVE</span>
          </div>

          <div className="fridge-items">
            {items.length > 0 ? (
              items.map((item) => (
                <div className="fridge-item" key={item._id}>
                  <span className="item-emoji">
                    {item.category === "Dairy"
                      ? "🥛"
                      : item.category === "Vegetable"
                      ? "🥦"
                      : item.category === "Meat"
                      ? "🥩"
                      : "📦"}
                  </span>

                  <span className="item-name">{item.name}</span>

                  <span
                    className={`item-expiry ${
                      new Date(item.expiryDate) - new Date() <
                      3 * 24 * 60 * 60 * 1000
                        ? "expiry-yellow"
                        : ""
                    }`}
                  >
                    {getExpiryText(item.expiryDate)}
                  </span>
                </div>
              ))
            ) : (
              <div className="fridge-item" style={{ opacity: 0.6 }}>
                No items added yet
              </div>
            )}
          </div>

          <div className="recipe-suggestion">
            <div className="recipe-label">✨ AI Suggestion</div>

            <div className="recipe-name">
              {items[0]
                ? `${items[0].name} Special Dish`
                : "Waiting for ingredients..."}
            </div>

            <div className="recipe-meta">
              Uses expiring items · 15 min · 320 kcal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}