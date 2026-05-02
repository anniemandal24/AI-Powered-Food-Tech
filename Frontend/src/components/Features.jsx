import "./Features.css";

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="section-label">Featurs</div>
      <div className="section-title">
        Everything your <span className="section-title-span">kitchen</span>
        <br />
        <span className="section-title-span">needs to</span> be smarter
      </div>
      <div className="features-layout reveal visible">
        <div className="feature-phone">
          <div className="phone-screen-title">
            <span>My Pantry</span>
            <span className="notification-dot"></span>
          </div>
          <div className="ingredient-list">
            <div className="ingredient-row">
              <div className="ing-left">
                <span className="ing-emoji">🥦</span>
                <div>
                  <div className="ing-name">Broccoli</div>
                  <div className="ing-qty">1 head · Fridge</div>
                </div>
              </div>
              <span className="exp-tag exp-warn">2 days</span>
            </div>
            <div className="ingredient-row">
              <div className="ing-left">
                <span className="ing-emoji">🥦</span>
                <div>
                  <div className="ing-name">Broccoli</div>
                  <div className="ing-qty">1 head · Fridge</div>
                </div>
              </div>
              <span className="exp-tag exp-warn">2 days</span>
            </div>
            <div className="ingredient-row">
              <div className="ing-left">
                <span className="ing-emoji">🥦</span>
                <div>
                  <div className="ing-name">Broccoli</div>
                  <div className="ing-qty">1 head · Fridge</div>
                </div>
              </div>
              <span className="exp-tag exp-warn">2 days</span>
            </div>
            <div className="ingredient-row">
              <div className="ing-left">
                <span className="ing-emoji">🥦</span>
                <div>
                  <div className="ing-name">Broccoli</div>
                  <div className="ing-qty">1 head · Fridge</div>
                </div>
              </div>
              <span className="exp-tag exp-warn">2 days</span>
            </div>
            <div className="ingredient-row">
              <div className="ing-left">
                <span className="ing-emoji">🥦</span>
                <div>
                  <div className="ing-name">Broccoli</div>
                  <div className="ing-qty">1 head · Fridge</div>
                </div>
              </div>
              <span className="exp-tag exp-warn">2 days</span>
            </div>
            <div className="ingredient-row">
              <div className="ing-left">
                <span className="ing-emoji">🥦</span>
                <div>
                  <div className="ing-name">Broccoli</div>
                  <div className="ing-qty">1 head · Fridge</div>
                </div>
              </div>
              <span className="exp-tag exp-warn">2 days</span>
            </div>
            <div className="ingredient-row">
              <div className="ing-left">
                <span className="ing-emoji">🥦</span>
                <div>
                  <div className="ing-name">Broccoli</div>
                  <div className="ing-qty">1 head · Fridge</div>
                </div>
              </div>
              <span className="exp-tag exp-warn">2 days</span>
            </div>
          </div>
          <div className="ai-recipe-box">
            <div className="ai-label">✨ Best Recipe Now</div>
            <div className="ai-recipe-title">Cheesy Broccoli Omelette</div>
            <div className="ai-tags">
              <span className="ai-tag">⏱ 15 min</span>
              <span className="ai-tag">🔥 320 kcal</span>
              <span className="ai-tag">♻️ Saves 2 items</span>
            </div>
          </div>
        </div>
        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon-wrap">🔍</div>
            <div className="feature-text">
              <h3 className="feature-text-h3">Computer Vision Scanning</h3>
              <p className="feature-text-p">Advanced AI identifies 500+ grocery items from a single photo. No barcodes needed — just point and shoot.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrap">🔔</div>
            <div className="feature-text">
              <h3 className="feature-text-h3">Smart Expiry Alerts</h3>
              <p className="feature-text-p">Get notified 3 days before items expire. Never let food silently go bad in the back of your fridge again.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrap">🍽️</div>
            <div className="feature-text">
              <h3 className="feature-text-h3">AI Recipe Generation</h3>
              <p className="feature-text-p">Personalized recipes based on exactly what you have, your dietary preferences, and your cooking skill level.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrap">🛒</div>
            <div className="feature-text">
              <h3 className="feature-text-h3">Smart Shopping Lists</h3>
              <p className="feature-text-p">Auto-generated grocery lists that only include what you actually need — no duplicates, no waste.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}