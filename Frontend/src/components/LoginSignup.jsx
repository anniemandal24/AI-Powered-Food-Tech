import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginSignup.css";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // where user wanted to go
  const from = location.state?.from?.pathname || "/scan-fridge";

  const handleLogin = () => {
    const userData = {
      email,
      password,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    navigate(from, { replace: true });
  };
  const handleSignup = () => {
    // store signup data (optional)
    const userData = {
      email,
      password,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    navigate(from, { replace: true });
  };



  return (
    <div className="login-auth-container">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>

      <div className={`login-auth-box ${isLogin ? "" : "active"}`}>

        {/* LEFT PANEL */}
        <div className="login-form-section">
          {isLogin ? (
            <div className="login-form">
              <h2 className="login-form-h2">Welcome Back 👋</h2>
              <p className="login-form-p">Login to continue</p>

              <input className="login-form-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="login-form-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <button className="login-btn" onClick={handleLogin}>
                Login
              </button>

              <span
                className="login-form-span"
                onClick={() => setIsLogin(false)}
              >
                Don’t have an account? Sign Up
              </span>
            </div>
          ) : (
            <div className="login-form">
              <h2 className="login-form-h2">Create Account 🚀</h2>
              <p className="login-form-p">Start your journey</p>

              <input className="login-form-input" type="text" placeholder="Full Name" />
              <input className="login-form-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <input className="login-form-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <button className="login-btn" onClick={handleSignup}>Sign Up</button>

              <span
                className="login-form-span"
                onClick={() => setIsLogin(true)}
              >
                Already have an account? Login
              </span>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="login-info-section">
          <div className="login-info-section-div">
            <h1 className="login-info-section-h1">Stop Wasting Food.</h1>
            <h2 className="login-info-section-h2">Start Eating Smarter</h2>
            <p className="login-info-form-p">
              AI-powered kitchen assistant that tracks expiry and suggests recipes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}