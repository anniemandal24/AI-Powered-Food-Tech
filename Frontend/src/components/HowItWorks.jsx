import "./HowitWorks.css";
export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how">
      <div className="section-label">How It Works</div>
      <h2 className="section-title">
        From fridge to fork
        <br />
        <span className="section-title-span">in 3 simple steps</span>
      </h2>
      <p className="section-sub">No manual entry. No complicated setup. Just point, scan, and cook.</p>
      <div className="steps-grid reveal visible">
        <div className="step-card">
          <div className="step-num">01</div>
          <div className="step-icon">📸</div>
          <div className="step-title">Scan Your Fridge</div>
          <div className="step-desc">Open the app and photograph your fridge or individual items. Our computer vision AI identifies everything instantly.</div>
        </div>
        <div className="step-card">
          <div className="step-num">02</div>
          <div className="step-icon">🧠</div>
          <div className="step-title">AI Tracks Expiry</div>
          <div className="step-desc">FreshMind automatically assigns expiry dates and alerts you before items go bad — color coded for instant awareness.</div>
        </div>
        <div className="step-card">
          <div className="step-num">03</div>
          <div className="step-icon">👨‍🍳</div>
          <div className="step-title">Get Recipe Ideas</div>
          <div className="step-desc">Our AI chef suggests the best recipes using your available ingredients, prioritizing items that expire soonest.</div>
        </div>
        <div className="step-card">
          <div className="step-num">04</div>
          <div className="step-icon">📊</div>
          <div className="step-title">Track Your Impact</div>
          <div className="step-desc">Watch your waste score drop over time. See money saved, CO₂ reduced, and streaks for zero-waste weeks.</div>
        </div>
      </div>
    </section>
  );
}