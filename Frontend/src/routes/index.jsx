import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import LoginSignup from "../pages/auth/LoginSignup";
import ProtectedRoute from "./ProtectedRoute";
import AIchat from "../pages/chat/AIchat";
// Import your new inventory pages
import InventoryPage from "../pages/inventory/InventoryPage"; 
import AddItem from "../pages/inventory/AddItem"; 

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login-signup" element={<LoginSignup />} />

      {/* Protected Inventory Routes */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-item"
        element={
          <ProtectedRoute>
            <AddItem />
          </ProtectedRoute>
        }
      />

      {/* Chat (Protected) */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AIchat />
          </ProtectedRoute>
        }
      />

      {/* 
        Keep scan-fridge only if you still have that page, 
        otherwise /add-item replaces its purpose. 
      */}
      <Route
        path="/scan-fridge"
        element={
          <ProtectedRoute>
            <AIchat /> 
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}