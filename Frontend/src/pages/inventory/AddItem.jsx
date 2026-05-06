import React, { useState } from "react";
import { inventoryService } from "../../services/inventoryServices.js";
import { useNavigate } from "react-router-dom";
import "./AddItem.css";

export default function AddItem() {
    const [formData, setFormData] = useState({
        name: "",
        category: "Other", // Default value
        quantity: 1,
        expiryDate: "",
        isEstimatedExpiry: false,
        source: "MANUAL",
        cost: 0
    });
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(formData.expiryDate) < new Date(today)) {
            alert("Expiry date cannot be in the past.");
            return;
        }
        try {
            // All required fields included for the backend
            await inventoryService.addItem({
                ...formData,
                status: "AVAILABLE",
                quantity: Number(formData.quantity),
                cost: Number(formData.cost)
            });
            navigate("/inventory"); 
        } catch (err) {
            console.error("Submission error:", err);
            alert("Could not save item. Please check your connection.");
        }
    };

    return (
        <div className="add-item-page">
            <form className="add-item-form" onSubmit={handleSubmit}>
                <h2>Add New Item</h2>
                
                <div className="form-group full">
                    <label>Item Name</label>
                    <input type="text" name="name" placeholder="e.g. Fresh Milk" required 
                        value={formData.name} onChange={handleChange} />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Category (User Choice)</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="Vegetable">Vegetable</option>
                            <option value="Fruit">Fruit</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Meat">Meat</option>
                            <option value="Bakery">Bakery</option>
                            <option value="Grains">Grains</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Expiry Date</label>
                        <input type="date" name="expiryDate" required value={formData.expiryDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Cost</label>
                        <input type="number" name="cost" step="0.01" value={formData.cost} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group full">
                    <label>Source (Store/Location)</label>
                    <input type="text" name="source" placeholder="e.g. Local Mart" 
                        value={formData.source} onChange={handleChange} />
                </div>

                <div className="checkbox-group">
                    <input 
                        type="checkbox" 
                        name="isEstimatedExpiry" 
                        id="isEstimated"
                        checked={formData.isEstimatedExpiry} 
                        onChange={handleChange} 
                    />
                    <label htmlFor="isEstimated">This date is an estimate</label>
                </div>

                <button type="submit" className="submit-btn">Save to Fridge</button>
            </form>
        </div>
    );
}