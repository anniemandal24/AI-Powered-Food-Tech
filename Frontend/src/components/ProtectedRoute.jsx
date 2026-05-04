import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login-signup" state={{ from: location }} replace />;
  }

  return children;
}