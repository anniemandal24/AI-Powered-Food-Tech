import Testimonials from '../home/Testimonials';
import Hero from '../home/Hero';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../home/notificationBell";

<Link to="/chat">AI Chat</Link>
    const section = document.getElementById("hero");
    section.scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  // 🔐 Handle Scan Button Click (with auth check)
  const handleScanClick = () => {

    const token = localStorage.getItem("accessToken");
    if (token && token !== "undefined") {
      console.log("Auth verified: Navigating to Inventory");
      navigate("/inventory")
    }
    else {
      console.log("No token found: Redirecting to Login");
      // Use the 'state' property so the user is sent back here after logging in
      navigate("/login-signup", { state: { from: "/inventory" } });
    }
  };


  return (
    <nav className="nav">
      <div className="logo">
        <li><a onClick={handleScroll4}>Reviews</a></li>
        <li><NotificationBell /></li>
      </div>
      {!token || token === "undefined" ? (
        <button className='nav-cat' onClick={handleScanClick}>Get Started Free</button>
      ) : null}
    </nav>
  );
}