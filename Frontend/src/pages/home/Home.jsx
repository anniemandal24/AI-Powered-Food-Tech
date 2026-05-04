import Navbar from "./Navbar";
import Hero from "./Hero";
import Stats from "./Stats";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import Impact from "./Impact";
import Testimonials from "./Testimonials";
import CTA from "./CTA";
import Footer from "./Footer";
export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <Stats />
            <HowItWorks />
            <Features />
            <Impact />
            <Testimonials />
            <CTA />
            <Footer />
        </>
    )
}