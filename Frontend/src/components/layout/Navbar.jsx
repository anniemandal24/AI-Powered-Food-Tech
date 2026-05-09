import './Navbar.css';
import { useState, useEffect } from 'react';
import HowItWorks from '../home/HowItWorks';
import Features from '../home/Features';
import Impact from '../home/Impact';
import Testimonials from '../home/Testimonials';
import Hero from '../home/Hero';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../home/notificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // 🔽 Scroll handlers (unchanged)
  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 🔐 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // remove token
    logout(); // clear context
    navigate("/"); // go to home
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  // 🔐 Handle Scan Button Click (with auth check)
  const handleScanClick = () => {

    const token = localStorage.getItem("accessToken");
    if (token && token !== "undefined") {
      console.log("Auth verified: Navigating to Inventory");
      navigate("/inventory")
    }
    else {
      console.log("No token found: Redirecting to Login");
      // Use the 'state' property so the user is sent back here after logging in
      navigate("/login-signup", { state: { from: "/inventory" } });
    }
  };


  return (
    <nav className="nav">
      {/* LOGO */}
      <div className="logo" onClick={() => scrollTo("hero")}>
        <div className="logo-dot"></div>
        FreshMind AI
      </div>

      {/* NAV LINKS */}
      <div className="nav-links">
        <li><a onClick={() => scrollTo("hero")}>Home</a></li>
        <li><a onClick={() => scrollTo("how")}>How It Works</a></li>
        <li><a onClick={() => scrollTo("features")}>Features</a></li>
        <li><a onClick={() => scrollTo("impact")}>Impact</a></li>
        <li><a onClick={() => scrollTo("reviews")}>Reviews</a></li>

        {/* ✅ Chat link */}
        <li>
          <Link to="/chat">AI Chat</Link>
        </li>

        <li>
          <NotificationBell />
        </li>
      </div>

      {/* 🔐 RIGHT SIDE */}
      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-name">Hi, {user.name}</span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button
            className="nav-cat"
            onClick={() => navigate("/login-signup")}
          >
            Get Started Free
          </button>
        )}
      </div>
      {!token || token === "undefined" ? (
        <button className='nav-cat' onClick={handleScanClick}>Get Started Free</button>
      ) : null}
    </nav>
  );
}