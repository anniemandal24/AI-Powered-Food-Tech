import "./Footer.css"
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer>
      <div className="footer-logo">🌱 FreshMind AI</div>
      <div className="footer-links">
        <a className="footer-links-a" onClick={() => {navigate("/freah-mind-ai-about")}}>About</a>
        <a className="footer-links-a" onClick={() => {navigate("/freah-mind-ai-features")}}>Features</a>
        <a className="footer-links-a" onClick={() => {navigate("/freah-mind-ai-privacy")}}>Privacy</a>
        <a className="footer-links-a" onClick={() => {navigate("/freah-mind-ai-contact")}}>Contact</a>
      </div>
      <div className="footer-copy">© 2026 FreshMind AI</div>
    </footer>
  );
}