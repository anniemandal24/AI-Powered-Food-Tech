import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added for navigation
import { inventoryService } from "../../services/inventoryServices";
import "./Features.css";

export default function Features() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyPantry = async () => {
      try {
        const data = await inventoryService.getAllItems();
        // Filter for AVAILABLE items (auto-processed WASTED items are hidden)
        const activeItems = data.filter(item => item.status === "AVAILABLE");
        setInventory(activeItems.slice(0, 7));
      } catch (err) {
        console.error("Failed to fetch features preview:", err);
      } finally {
        setLoading(false);
      }
    };
    getMyPantry();
  }, []);

  const getExpTag = (expiryDate) => {
    const diff = new Date(expiryDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return { text: "Expired", class: "exp-critical" };
    if (days <= 3) return { text: `${days} days`, class: "exp-warn" };
    return { text: `${days} days`, class: "exp-safe" };
  };

  return (
    <section className="features" id="features">
      <div className="section-label">Features</div>
      <div className="section-title">
        Everything your <span className="section-title-span">kitchen</span>
        <br />
        <span className="section-title-span">needs to</span> be smarter
      </div>
      
      <div className="features-layout reveal visible">
        <div className="feature-phone">
          <div className="phone-screen-title">
            <span>My Pantry</span>
            <span className="notification-dot"></span>
          </div>

          <div className="ingredient-list">
            {loading ? (
               <div className="ingredient-row" style={{justifyContent: 'center'}}>Loading...</div>
            ) : inventory.length > 0 ? (
              inventory.map((item) => {
                const tag = getExpTag(item.expiryDate);
                return (
                  <div className="ingredient-row" key={item._id}>
                    <div className="ing-left">
                      <span className="ing-emoji">
                        {item.category === "Dairy" ? "🥛" : 
                         item.category === "Meat" ? "🥩" : "🥦"}
                      </span>
                      <div>
                        <div className="ing-name">{item.name}</div>
                        <div className="ing-qty">{item.quantity} · Fridge</div>
                      </div>
                    </div>
                    <span className={`exp-tag ${tag.class}`}>{tag.text}</span>
                  </div>
                );
              })
            ) : (
              <div className="empty-pantry-cta" style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Your fridge is empty!</p>
                <button 
                  onClick={() => navigate("/add-item")}
                  style={{ 
                    marginTop: '10px', 
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    border: 'none', 
                    backgroundColor: '#2ecc71', 
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  + Add First Item
                </button>
              </div>
            )}
          </div>

          <div className="ai-recipe-box">
            <div className="ai-label">✨ Best Recipe Now</div>
            <div className="ai-recipe-title">
              {inventory.length > 0 ? `Fresh ${inventory[0].name} Mix` : "Add items to see recipes"}
            </div>
            <div className="ai-tags">
              <span className="ai-tag">⏱ 15 min</span>
              <span className="ai-tag">🔥 320 kcal</span>
              <span className="ai-tag">♻️ Smart Choice</span>
            </div>
          </div>
        </div>

        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon-wrap">🔍</div>
            <div className="feature-text">
              <h3 className="feature-text-h3">Manual Inventory Tracking</h3>
              <p className="feature-text-p">Easily log your groceries. Our system tracks what you have and keeps your kitchen organized.</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon-wrap">🔔</div>
            <div className="feature-text">
              <h3 className="feature-text-h3">Smart Expiry Alerts</h3>
              <p className="feature-text-p">Items turn yellow as they approach their date. Never let food silently go bad again.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-wrap">🍽️</div>
            <div className="feature-text">
              <h3 className="feature-text-h3">Waste Reduction</h3>
              <p className="feature-text-p">Our automated cron jobs track wasted vs consumed items, helping you shop smarter.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-wrap">🛒</div>
            <div className="feature-text">
              <h3 className="feature-text-h3">Digital Kitchen</h3>
              <p className="feature-text-p">Access your fridge data anywhere. Know exactly what you have before you buy more.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}