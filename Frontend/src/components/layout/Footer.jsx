import "./Footer.css"
export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">🌱 FreshMind AI</div>
      <div className="footer-links">
        <a className="footer-links-a" href="#">About</a>
        <a className="footer-links-a" href="#">Features</a>
        <a className="footer-links-a" href="#">Privacy</a>
        <a className="footer-links-a" href="#">Contact</a>
      </div>
      <div className="footer-copy">© 2026 FreshMind AI · MAKAUT Hackathon</div>
    </footer>
  );
}