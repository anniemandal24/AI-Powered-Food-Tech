

import "./FooterFeaturesPage.css";
import {
  FaRobot,
  FaCamera,
  FaChartLine,
  FaBell,
  FaLeaf,
  FaCloud,
} from "react-icons/fa";

export default function FeaturesPage() {
  return (
    <div className="features-page">

      <div className="features-container">

        {/* HEADER */}
        <div className="features-header">

          <h4>••• Smart Features</h4>

          <h1>
            Powerful <span>Features</span> <br />
            Built for Smart Living
          </h1>

          <p>
            FreshMind AI combines intelligent technology with sustainability
            to help users manage groceries, reduce food waste, and maintain
            a smarter kitchen experience.
          </p>

        </div>

        {/* FEATURES GRID */}
        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">
              <FaRobot />
            </div>

            <h2>AI Recommendations</h2>

            <p>
              Get intelligent suggestions for recipes, food management,
              and grocery planning based on your fridge items.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaCamera />
            </div>

            <h2>Scan Your Fridge</h2>

            <p>
              Upload fridge images and let AI detect food items instantly
              for easy inventory management.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>

            <h2>Analytics Dashboard</h2>

            <p>
              Track food usage, monitor waste reduction, and visualize
              your sustainability progress with smart analytics.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaBell />
            </div>

            <h2>Expiry Notifications</h2>

            <p>
              Receive timely alerts before food items expire so you can
              reduce unnecessary waste and save money.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaLeaf />
            </div>

            <h2>Eco Friendly Goals</h2>

            <p>
              Promote sustainable living with personalized eco-friendly
              habits and waste reduction strategies.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaCloud />
            </div>

            <h2>Cloud Sync</h2>

            <p>
              Access your food inventory and AI insights from anywhere
              with secure real-time cloud synchronization.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}