import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import LoginSignup from "../pages/auth/LoginSignup";
import ProtectedRoute from "./ProtectedRoute";
import AIchat from "../pages/chat/AIchat";
import ScanFridge from "../pages/scan-fridge/ScanFridge";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login-signup" element={<LoginSignup />} />

      {/* Chat (Protected) */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AIchat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scan-fridge"
        element={
          <ProtectedRoute>
            <ScanFridge />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}