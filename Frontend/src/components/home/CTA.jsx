import "./CTA.css"
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function CTA() {
  const navigate = useNavigate();

  const handleScanClick = () => {
    const token = localStorage.getItem("accessToken");

    if (token && token !== "undefined") {
      console.log("Auth verified: Navigating to Inventory");
      navigate("/inventory")}
      else {
      console.log("No token found: Redirecting to Login");
      // Use the 'state' property so the user is sent back here after logging in
      navigate("/login-signup", { state: { from: "/inventory" } });
    }
  };
  return (
    <section className="cta-section">
      <h2 className="cta-section-h2">Ready to stop wasting food?</h2>
      <p className="cta-section-p">Join thousands of households saving money and reducing waste with FreshMind AI.</p>
      <button className="cta-btn" onClick={handleScanClick}>
        📸 Scan Your Fridge — It's Free
      </button>
    </section>
  );
}