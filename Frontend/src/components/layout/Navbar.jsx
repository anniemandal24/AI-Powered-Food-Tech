import "./Navbar.css";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/auth/useAuth";
import NotificationBell from "../home/notificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // 🔽 Scroll handlers (unchanged)
  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 🔐 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // remove token
    logout(); // clear context
    navigate("/"); // go to home
  };

  return (
    <nav className="nav">
      {/* LOGO */}
      <div className="logo" onClick={() => scrollTo("hero")}>
        <div className="logo-dot"></div>
        FreshMind AI
      </div>

      {/* NAV LINKS */}
      <div className="nav-links">
        <li><a onClick={() => scrollTo("hero")}>Home</a></li>
        <li><a onClick={() => scrollTo("how")}>How It Works</a></li>
        <li><a onClick={() => scrollTo("features")}>Features</a></li>
        <li><a onClick={() => scrollTo("impact")}>Impact</a></li>
        <li><a onClick={() => scrollTo("reviews")}>Reviews</a></li>

        {/* ✅ Chat link */}
        <li>
          <Link to="/chat">AI Chat</Link>
        </li>

        <li>
          <NotificationBell />
        </li>
      </div>

      {/* 🔐 RIGHT SIDE */}
      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-name">Hi, {user.name}</span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button
            className="nav-cat"
            onClick={() => navigate("/login-signup")}
          >
            Get Started Free
          </button>
        )}
      </div>
    </nav>
  );
}