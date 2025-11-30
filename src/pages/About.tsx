import useScrollAnimation from "../hooks/useScrollAnimation";
import "../styles/Home.css";

function About() {
    useScrollAnimation();
    return (
        <div className="about-page fade-in home-page">
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
            {/* same animated background as Home for visual parity */}
            <div className="animated-background" aria-hidden="true">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
                <div className="floating-shape shape-4"></div>
                <div className="floating-shape shape-5"></div>
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
                <div className="sparkle" style={{ top: '16%', left: '18%', animationDuration: '8s', animationDelay: '0s' }}></div>
                <div className="sparkle" style={{ top: '44%', left: '10%', animationDuration: '10s', animationDelay: '1s' }}></div>
                <div className="sparkle" style={{ top: '22%', left: '68%', animationDuration: '9s', animationDelay: '0.1s' }}></div>
            </div>
            <div className="page-header">
                <div className="hero-card-wrapper hero-entrance">
                    <div className="hero-card">
                        <h1>About Us</h1>
                        <p>TeamPro Personnel Tracking System</p>
                    </div>
                </div>
            </div>

            <div className="content-section" style={{ animation: 'fadeIn 0.6s ease-out' }}>
                <h2>About Company</h2>
                <p style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                    TeamPro is an innovative platform that provides secure solutions with blockchain technology for modern businesses' personnel
                    tracking and productivity management needs. Founded in 2025, our company provides businesses with a reliable and transparent
                    tracking system using Sui blockchain infrastructure.
                </p>
            </div>

            <div className="content-section" style={{ animation: 'fadeIn 0.8s ease-out' }}>
                <div className="info-grid">
                    <div className="info-card card">
                        <h3>Our Mission</h3>
                        <p>
                            To digitalize personnel management of businesses, increase efficiency and optimize business processes. To keep secure,
                            transparent and immutable records with blockchain technology.
                        </p>
                    </div>
                    <div className="info-card card">
                        <h3>Our Vision</h3>
                        <p>
                            To become Turkey's most preferred personnel tracking and productivity management platform. To provide innovative solutions to
                            the business world with Web3 technologies.
                        </p>
                    </div>
                    <div className="info-card card">
                        <h3>Our Values</h3>
                        <ul>
                            <li>Reliability and Transparency</li>
                            <li>Innovation and Technology</li>
                            <li>Customer Satisfaction</li>
                            <li>Data Security</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="content-section" style={{ animation: 'fadeIn 1s ease-out' }}>
                <h2>Why TeamPro?</h2>
                <div className="features-grid">
                    <div className="feature-card card">
                        <div className="icon" style={{ fontSize: '2.5rem' }}>🔗</div>
                        <h3>Blockchain</h3>
                        <p>Secure Infrastructure</p>
                    </div>
                    <div className="feature-card card">
                        <div className="icon" style={{ fontSize: '2.5rem' }}>⚡</div>
                        <h3>Real-Time</h3>
                        <p>Instant Tracking</p>
                    </div>
                    <div className="feature-card card">
                        <div className="icon" style={{ fontSize: '2.5rem' }}>📊</div>
                        <h3>Detailed Analysis</h3>
                        <p>Reporting</p>
                    </div>
                    <div className="feature-card card">
                        <div className="icon" style={{ fontSize: '2.5rem' }}>🎨</div>
                        <h3>Modern Interface</h3>
                        <p>User Friendly</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default About;
