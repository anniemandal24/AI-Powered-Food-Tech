import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Impact from "./components/Impact";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ScanFridge from "./components/ScanFridge";
import Home from "./components/Home";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan-fridge" element={<ScanFridge />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
