import { useNavigate } from "react-router-dom";
import "./Impact.css";

export default function Impact() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const token = localStorage.getItem("accessToken");

    // Not logged in
    if (!token || token === "undefined" || token === "null") {
      navigate("/login-signup", {
        state: { from: "/analytics" },
      });
      return;
    }

    // Logged in
    navigate("/analytics");
  };

  return (
    <section id="impact" className="dark">
      <div className="section-label">Your Impact</div>

      <h2 className="section-title">
        Track how much you save
      </h2>

      <p className="section-sub">
        Every meal cooked with expiring ingredients
        is a win for your wallet and the planet.
      </p>

      <div className="waste-cards reveal visible">

        <div
          className="waste-card"
          onClick={handleNavigate}
        >
          <div className="waste-card-icon">💰</div>

          <div className="waste-card-num">
            ₹3,240
          </div>

          <div className="waste-card-label">
            Saved this month
          </div>

          <div className="progress-bar-wrap">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill"></div>
            </div>
          </div>
        </div>

        <div
          className="waste-card"
          onClick={handleNavigate}
        >
          <div className="waste-card-icon">🌱</div>

          <div className="waste-card-num">
            12 kg
          </div>

          <div className="waste-card-label">
            CO₂ emissions saved
          </div>

          <div className="progress-bar-wrap">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill"></div>
            </div>
          </div>
        </div>

        <div
          className="waste-card"
          onClick={handleNavigate}
        >
          <div className="waste-card-icon">♻️</div>

          <div className="waste-card-num">
            18 kg
          </div>

          <div className="waste-card-label">
            Food waste prevented
          </div>

          <div className="progress-bar-wrap">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}