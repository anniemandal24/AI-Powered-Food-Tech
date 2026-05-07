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
} from "../../components/home";

export default function Home() {
  const navigate = useNavigate();

  // 📷 Scan button logic
  const handleScanClick = () => {
    const token = localStorage.getItem("accessToken");

    if (token && token !== "undefined" && token !== "null") {
      navigate("/scan-fridge"); // ✅ go to scan
    } else {
      navigate("/login-signup", {
        state: { from: "/scan-fridge" }, // ✅ return after login
      });
    }
  };

  return (
    <>
      <Navbar />

      {/* 📦 Inventory handled inside Hero */}
      <Hero />

      {/* 📷 SCAN SECTION */}
      <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-b from-white to-green-50">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 text-center">
          Ready to See What's in Your Fridge?
        </h2>

        <p className="text-gray-500 mb-6 text-center max-w-md">
          Snap a photo and let AI suggest recipes instantly based on your ingredients.
        </p>

        <button
          onClick={handleScanClick}
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