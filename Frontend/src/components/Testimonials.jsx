import "./Testimonials.css"
export default function Testimonials() {
  return (
    <section className="testimonials" id="reviews">
      <div className="section-label">Reviews</div>
      <div className="section-title">
        Loved by home cooks
        <br />
        across India
      </div>
      <div className="test-grid reveal visible">
        <div className="test-card">
          <div className="stars">★★★★★</div>
          <p className="test-quote">"I used to throw away vegetables every week without even realizing it. FreshMind completely changed that. The recipe suggestions are genuinely creative!"</p>
          <div className="test-author">
            <div className="test-avatar av1">👩</div>
            <div>
              <div className="test-name">Priya Sharma</div>
              <div className="test-role">Home Cook · Mumbai</div>
            </div>
          </div>
        </div>
        <div className="test-card">
          <div className="stars">★★★★★</div>
          <p className="test-quote">"As a student living alone, I was wasting money on groceries constantly. Now I scan my fridge on Sunday and meal-plan the whole week. Game changer."</p>
          <div className="test-author">
            <div className="test-avatar av2">👨‍🎓</div>
            <div>
              <div className="test-name">Arjun Mehta</div>
              <div className="test-role">College Student · Bangalore</div>
            </div>
          </div>
        </div>
        <div className="test-card">
          <div className="stars">★★★★★</div>
          <p className="test-quote">"The expiry alerts are lifesaving. I saved ₹4000 in the first month alone. The AI recipes are surprisingly delicious — my family loves them!"</p>
          <div className="test-author">
            <div className="test-avatar av3">👩‍👧</div>
            <div>
              <div className="test-name">Kavitha Nair</div>
              <div className="test-role">Working Mom · Chennai</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}