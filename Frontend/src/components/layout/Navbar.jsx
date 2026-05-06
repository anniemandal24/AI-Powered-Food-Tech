import './Navbar.css';
import { useState, useEffect } from 'react';
import HowItWorks from '../home/HowItWorks';
import Features from '../home/Features';
import Impact from '../home/Impact';
import Testimonials from '../home/Testimonials';
import Hero from '../home/Hero';
import { Link } from "react-router-dom";
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
      <button className='nav-cat'>Get Started Free</button>
    </nav>
  );
}