import "./LoginSignup.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, signupUser } from "../../services/authService";
import useAuth from "../../hooks/auth/useAuth";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/scan-fridge";

  // Helper to extract Zod or Backend errors
  const getErrorMessage = (err) => {
    // If backend returns the 'details' array from your Zod middleware
    if (err.response?.data?.details) {
      const details = err.response.data.details;
      if (Array.isArray(details)) {
        return details.map((d) => d.message).join(", ");
      }
      return typeof details === "string" ? details : JSON.stringify(details);
    }
    // Fallback to standard error messages
    return err.response?.data?.error || err.message || "An error occurred";
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      // Based on your backend structure, login usually expects res.data
      login(res.data); 
      navigate(from, { replace: true });
    } catch (err) {
      alert("Login Error: " + getErrorMessage(err));
    }
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    try {
      // Ensure data matches what your Zod schema expects
      const res = await signupUser({ name, email, password });
      login(res.data);
      navigate(from, { replace: true });
    } catch (err) {
      alert("Signup Error: " + getErrorMessage(err));
    }
  };

  return (
    <div className="login-auth-container">
      {/* Background decoration from your CSS */}
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>

      <div className={`login-auth-box ${!isLogin ? "active" : ""}`}>
        {/* FORM SECTION */}
        <div className="login-form-section">
          <form 
            className="login-form" 
            onSubmit={isLogin ? handleLogin : handleSignup}
          >
            <h2 className="login-form-h2">{isLogin ? "Login" : "Signup"}</h2>
            <p className="login-form-p">
              {isLogin ? "Welcome back! Please enter your details." : "Join us today!"}
            </p>

            {!isLogin && (
              <input
                className="login-form-input"
                type="text"
                placeholder="Full Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              className="login-form-input"
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="login-form-input"
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="login-btn">
              {isLogin ? "Login" : "Signup"}
            </button>

            <span 
              className="login-form-span" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
            </span>
          </form>
        </div>

        {/* INFO SECTION */}
        <div className="login-info-section">
          <div className="login-info-section-div">
            <h1 className="login-info-section-h1">FreshTrack</h1>
            <h2 className="login-info-section-h2">
              {isLogin ? "Hello, Friend!" : "Welcome Back!"}
            </h2>
            <p>
              {isLogin 
                ? "Stop wasting food. Start tracking your fridge today." 
                : "Keep your kitchen organized and your meals fresh."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}