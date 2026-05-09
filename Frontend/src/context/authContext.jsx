import { createContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  // 🛡️ Initialize state immediately and safely to prevent "undefined" crash
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      
      // Check if it exists and isn't the literal string "undefined"
      if (savedUser && savedUser !== "undefined") {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      localStorage.removeItem("user"); // Clean up corrupt data
      localStorage.removeItem("accessToken");
    }
    return null;
  });

  // ✅ LOGIN: Handles various backend response shapes
  const login = (data) => {
    console.log("Login Data Received:", data);

    // Support responses like { data: { user, accessToken } } or { user, accessToken }
    const authData = data?.data || data;
    const userData = authData?.user;
    const token = authData?.accessToken || authData?.token;

    if (token && userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", token);
      setUser(userData);
    } else {
      console.error("Login failed: Response missing user or token", data);
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}