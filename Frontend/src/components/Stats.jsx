import "./Stats.css"
export default function Stats() {
  return (
    <div className="stats-bar">
      <div className="stat">
        <div className="stat-num">₹50K</div>
        <div className="stat-label">food wasted per household/year</div>
      </div>
      <div className="stat-divider"></div>
      <div className="stat">
        <div className="stat-num">30%</div>
        <div className="stat-label">of groceries thrown away unused</div>
      </div>
      <div className="stat-divider"></div>
      <div className="stat">
        <div className="stat-num">40%</div>
        <div className="stat-label">waste reduction with FreshMind</div>
      </div>
      <div className="stat-divider"></div>
      <div className="stat">
        <div className="stat-num">10K+</div>
        <div className="stat-label">recipes in our AI database</div>
      </div>
    </div>
  );
}