import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  // 🛑 prevent crash if context not ready
  if (!auth) return null;

  const { user, loading } = auth;

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login-signup" state={{ from: location }} replace />;
  }

  return children;
}