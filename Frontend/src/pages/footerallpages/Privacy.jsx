// PrivacyPolicy.jsx

import "./Privacy.css";
import {
  FaShieldAlt,
  FaLock,
  FaUserSecret,
  FaDatabase,
  FaEnvelopeOpenText,
} from "react-icons/fa";

export default function Privacy() {
  return (
    <div className="privacy-page">
      <div className="privacy-container">

        {/* HEADER */}
        <div className="privacy-header">
          <h4>••• Privacy & Security</h4>

          <h1>
            Privacy <span>Policy</span>
          </h1>

          <p>
            Your privacy matters to us. FreshMind AI is committed to protecting
            your personal information and ensuring transparency in how your
            data is collected, used, and secured.
          </p>
        </div>

        {/* CONTENT */}
        <div className="privacy-content">

          <div className="privacy-card">
            <div className="privacy-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h2>Information We Collect</h2>

              <p>
                We may collect personal information such as your name,
                email address, account details, and usage activity to
                improve your experience and platform performance.
              </p>
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">
              <FaLock />
            </div>

            <div>
              <h2>How We Protect Data</h2>

              <p>
                We use secure technologies, encrypted storage, and trusted
                authentication systems to protect your data from unauthorized
                access or misuse.
              </p>
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">
              <FaUserSecret />
            </div>

            <div>
              <h2>User Privacy Rights</h2>

              <p>
                You have the right to access, update, or delete your
                personal information at any time through your account
                settings or by contacting our support team.
              </p>
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">
              <FaDatabase />
            </div>

            <div>
              <h2>Data Usage</h2>

              <p>
                Collected data helps us personalize recommendations,
                improve AI features, optimize system performance, and
                enhance food waste management solutions.
              </p>
            </div>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon">
              <FaEnvelopeOpenText />
            </div>

            <div>
              <h2>Contact Regarding Privacy</h2>

              <p>
                If you have questions about this Privacy Policy or how your
                information is handled, feel free to contact us anytime at
                fresh.mind.ai.support@gmail.com.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}