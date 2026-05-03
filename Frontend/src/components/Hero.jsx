import "./Hero.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleScanClick = () => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/scan-fridge");
    } else {
      navigate("/login-signup");
    }
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>

      <div className="hero-content">
        <div className="hero-badge">🌱 AI-Powered Kitchen Assistant</div>

        <h1>
          Stop Wasting Food.
          <br />
          <span className="hero-badge-spn">Start Eating</span>
          <br />
          Smarter.
        </h1>

        <p>
          FreshMind AI scans your fridge, tracks expiry dates, and suggests
          delicious recipes before your groceries go bad — saving money,
          reducing waste, and making cooking effortless.
        </p>

        <div className="hero-btns">
          <button className="btn-primary" onClick={handleScanClick}>
            📸 Scan Your Fridge
          </button>

          <button className="btn-secondary">
            Watch Demo →
          </button>
        </div>
      </div>

      {/* Right UI */}
      <div className="hero-visual">
        <div className="fridge-card">
          <div className="fridge-header">
            <span className="fridge-title">My Fridge 🧊</span>
            <span className="scan-badge">● LIVE</span>
          </div>

          <div className="fridge-items">
            {[1, 2, 3, 4].map((item) => (
              <div className="fridge-item" key={item}>
                <span className="item-emoji">🥦</span>
                <span className="item-name">Broccoli</span>
                <span className="item-expiry expiry-yellow">
                  2 days left
                </span>
              </div>
            ))}
          </div>

          <div className="recipe-suggestion">
            <div className="recipe-label">✨ AI Suggestion</div>
            <div className="recipe-name">
              Cheesy Broccoli Omelette
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