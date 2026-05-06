import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { inventoryService } from "../../services/inventoryServices.js";
import "./InventoryPage.css";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await inventoryService.getAllItems();
      // Only show items that haven't been marked as wasted/consumed
      setInventory((data || []).filter((item) => item.status === "AVAILABLE"));
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const getExpTag = (expiryDate) => {
    const diff = new Date(expiryDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) return { text: "Expired", class: "critical" };
    if (days <= 3) return { text: `Expiring in ${days}d`, class: "warning" };
    return { text: `${days} days left`, class: "safe" };
  };

  if (loading) return <div className="loader">Loading your fridge...</div>;

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <div>
          <h1>My Digital Fridge</h1>
          <p>{inventory.length} items currently tracked</p>
        </div>
        <button className="add-btn" onClick={() => navigate("/add-item")}>
          + Add New Item
        </button>
      </header>

      {inventory.length > 0 ? (
        <div className="inventory-grid">
          {inventory.map((item) => {
            const tag = getExpTag(item.expiryDate);
            return (
              <div className="inventory-card" key={item._id}>
                <div className="card-emoji">
                  {item.category === "Dairy" ? "🥛" : 
                   item.category === "Vegetable" ? "🥦" : 
                   item.category === "Meat" ? "🥩" : "📦"}
                </div>
                <div className="card-info">
                  <h3>{item.name}</h3>
                  <p className="qty">{item.quantity} units</p>
                  <span className={`status-tag ${tag.class}`}>{tag.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🧊</div>
          <h2>Your fridge is empty!</h2>
          <p>Start by adding items you just bought.</p>
          <button onClick={() => navigate("/add-item")}>Add First Item</button>
        </div>
      )}
    </div>
  );
}