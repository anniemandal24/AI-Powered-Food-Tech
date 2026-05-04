import "./CTA.css"
import React from "react";
import { Link } from "react-router-dom";
export default function CTA() {
  return (
    <section className="cta-section">
      <h2 className="cta-section-h2">Ready to stop wasting food?</h2>
      <p className="cta-section-p">Join thousands of households saving money and reducing waste with FreshMind AI.</p>
      <Link className="cta-btn" to={"/scan-fridge"}>📸 Scan Your Fridge — It's Free</Link>
    </section>
  );
}