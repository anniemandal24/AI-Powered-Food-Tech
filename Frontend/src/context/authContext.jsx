import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔁 Restore user from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ LOGIN
  const login = (data) => {
    // data = { user, accessToken }
    const { user, accessToken } = data;

    // store both
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);

    setUser(user);
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