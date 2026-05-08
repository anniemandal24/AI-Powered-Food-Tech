// AboutPage.jsx

import "./About.css";
import {
    FaLeaf,
    FaUsers,
    FaLightbulb,
    FaRecycle,
    FaFacebookF,
    FaInstagram,
} from "react-icons/fa";

export default function About() {
    return (
        <div className="about-page">
            <div className="about-container">

                {/* LEFT SIDE */}
                <div className="about-left">

                    <h4 className="about-subtitle">••• About FreshMind AI</h4>

                    <h1 className="about-title">
                        Building a <span>Smarter</span> <br />
                        Sustainable Future
                    </h1>

                    <p className="about-description">
                        At FreshMind AI, we are transforming the way people manage food
                        and reduce waste using intelligent technology. Our platform helps
                        users track groceries, analyze food freshness, and make better
                        decisions for a healthier and zero-waste lifestyle.
                    </p>

                    {/* FEATURES */}
                    <div className="about-features">

                        <div className="feature-box">
                            <div className="feature-icon">
                                <FaLeaf />
                            </div>

                            <div>
                                <h3>Eco Friendly</h3>
                                <p>
                                    Encouraging sustainable food habits and reducing unnecessary waste.
                                </p>
                            </div>
                        </div>

                        <div className="feature-box">
                            <div className="feature-icon">
                                <FaLightbulb />
                            </div>

                            <div>
                                <h3>AI Powered</h3>
                                <p>
                                    Smart recommendations and analytics to manage your kitchen efficiently.
                                </p>
                            </div>
                        </div>

                        <div className="feature-box">
                            <div className="feature-icon">
                                <FaUsers />
                            </div>

                            <div>
                                <h3>User Focused</h3>
                                <p>
                                    Designed for students, families, and anyone who values smarter living.
                                </p>
                            </div>
                        </div>

                        <div className="feature-box">
                            <div className="feature-icon">
                                <FaRecycle />
                            </div>

                            <div>
                                <h3>Zero Waste Vision</h3>
                                <p>
                                    Helping communities move toward a greener and cleaner future.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* SOCIAL */}
                    <div className="about-social">
                        <a onClick={() =>
                            window.open(
                                "https://www.facebook.com/profile.php?id=61589140093831",
                            )
                        }>
                            <FaFacebookF />
                        </a>
                        <a onClick={() =>
                            window.open(
                                "https://www.instagram.com/fresh.mind.ai?igsh=NXZyYWltMzA3bzh6",
                            )
                        }>
                            <FaInstagram />
                        </a>
                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="about-right">

                    <div className="about-image-card">

                        <img
                            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop"
                            alt="About FreshMind AI"
                        />

                        <div className="about-overlay-card">
                            <h2>5K+</h2>
                            <p>Users Reducing Food Waste</p>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}