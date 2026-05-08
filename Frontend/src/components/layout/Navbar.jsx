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

<Link to="/chat">AI Chat</Link>

export default function Navbar() {
  const handleScroll = () => {
    const section = document.getElementById("how");
    section.scrollIntoView({ behavior: "smooth" });
  };
  const handleScroll2 = () => {
    const section = document.getElementById("features");
    section.scrollIntoView({ behavior: "smooth" });
  };
  const handleScroll3 = () => {
    const section = document.getElementById("impact");
    section.scrollIntoView({ behavior: "smooth" });
  };
  const handleScroll4 = () => {
    const section = document.getElementById("reviews");
    section.scrollIntoView({ behavior: "smooth" });
  };
  const handleScroll0 = () => {
    const section = document.getElementById("hero");
    section.scrollIntoView({ behavior: "smooth" });
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
      <div className="logo">
        <div className="logo-dot"></div>
        FreshMind AI
      </div>
      <div className="nav-links">
        <li><a onClick={handleScroll0}>Home</a></li>
        <li><a onClick={handleScroll}>How It Works</a></li>
        <li><a onClick={handleScroll2}>Features</a></li>
        <li><a onClick={handleScroll3}>Impact</a></li>
        <li><a onClick={handleScroll4}>Reviews</a></li>
        <li><NotificationBell /></li>
      </div>
      {!token || token === "undefined" ? (
        <button className='nav-cat' onClick={handleScanClick}>Get Started Free</button>
      ) : null}
    </nav>
  );
}