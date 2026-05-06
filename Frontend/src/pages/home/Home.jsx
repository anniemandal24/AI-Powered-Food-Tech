import { useNavigate } from "react-router-dom";
import { Navbar, Footer } from "../../components/layout";
import {
  Hero,
  Stats,
  HowItWorks,
  Features,
  Impact,
  Testimonials,
  CTA,
  ScanSection,
} from "../../components/home";

export default function Home() {
  const navigate = useNavigate();

  // 🔐 Handle Scan Button Click (with auth check)
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
    <>
      <Navbar />

      <Hero />

      {/* 🚀 Scan Section (UPDATED) */}
      <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-b from-white to-green-50">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 text-center">
          Ready to See What's in Your Fridge?
        </h2>

        <p className="text-gray-500 mb-6 text-center max-w-md">
          Snap a photo and let AI suggest recipes instantly based on your ingredients.
        </p>

        <button
          onClick={handleScanClick}   // ✅ IMPORTANT CHANGE
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl text-lg shadow-md transition transform hover:scale-105"
        >
          📷 Scan Your Fridge
        </button>
      </div>

      <Stats />
      <HowItWorks />
      <Features />
      <Impact />
      <Testimonials />
      <CTA />

      <Footer />
    </>
  );
}