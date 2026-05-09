// ContactPage.jsx

import "./ContactPage.css";
import {
    FaFacebookF,
    FaTwitter,
    FaYoutube,
    FaLinkedinIn,
    FaInstagram,
} from "react-icons/fa";
import { HiLocationMarker, HiMail } from "react-icons/hi";
import { BsTelephoneFill } from "react-icons/bs";

export default function ContactPage() {
    return (
        <div className="contact-page">
            <div className="contact-container">

                {/* Left Section */}
                <div className="contact-left">
                    <p className="small-heading">••• Quick Contact</p>

                    <h1>Contact Us</h1>

                    <p className="description">
                        At FreshMind AI, we are always here to help and answer your questions. Whether you need support, collaborate with us, our team is ready to connect with you. Reach out anytime and let’s work together, zero-waste future.

                    </p>

                    {/* Contact Items */}
                    <div className="contact-info">

                        <div className="info-box">
                            <div className="icon-circle">
                                <HiLocationMarker />
                            </div>

                            <div>
                                <h3>Locations</h3>
                                <p>MAKAUT, Haringhata Farm, West Bengal 741249</p>
                            </div>
                        </div>

                        <div className="info-box">
                            <div className="icon-circle">
                                <HiMail />
                            </div>

                            <div>
                                <h3>Email Us</h3>
                                <p>fresh.mind.ai.support@gmail.com</p>
                            </div>
                        </div>

                        <div className="info-box">
                            <div className="icon-circle">
                                <BsTelephoneFill />
                            </div>

                            <div>
                                <h3>Phone Us</h3>
                                <p>+91 9679020281</p>
                            </div>
                        </div>

                    </div>

                    <div className="line"></div>

                    {/* Social Icons */}
                    <div className="social-icons">
                        <div className="social facebook" onClick={() =>
                            window.open(
                                "https://www.facebook.com/profile.php?id=61589140093831",
                            )
                        }>
                            <FaFacebookF />
                        </div>

                        <div className="social" onClick={() =>
                            window.open(
                                "https://www.instagram.com/fresh.mind.ai?igsh=NXZyYWltMzA3bzh6",
                            )
                        }>
                            <FaInstagram />
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="contact-right">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11871.018498651374!2d88.54385194017253!3d22.962182911903167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8bf5871a9e0d7%3A0x3cbdf3b9f157e355!2sMaulana%20Abul%20Kalam%20Azad%20University%20of%20Technology!5e0!3m2!1sen!2sin!4v1778166347712!5m2!1sen!2sin"
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
