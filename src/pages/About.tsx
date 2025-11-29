import "../styles/Dashboard.css";

function About() {
    return (
        <div className="dashboard-main">
            <div className="dashboard-content">
                <div className="content-header">
                    <h1>About Us</h1>
                    <p>TeamPro Personnel Tracking System</p>
                </div>

                <div className="info-section">
                    <div className="chart-card full-width">
                        <h2>🏢 About Company</h2>
                        <p style={{ lineHeight: "1.8", fontSize: "1.1em" }}>
                            TeamPro is an innovative platform that provides secure solutions with blockchain technology for modern businesses' personnel
                            tracking and productivity management needs. Founded in 2025, our company provides businesses with a reliable and transparent
                            tracking system using Sui blockchain infrastructure.
                        </p>
                    </div>
                    <br />
                    <div className="info-grid">
                        <div className="info-card">
                            <h3>🎯 Our Mission</h3>
                            <p>
                                To digitalize personnel management of businesses, increase efficiency and optimize business processes. To keep secure,
                                transparent and immutable records with blockchain technology.
                            </p>
                        </div>
                        <div className="info-card">
                            <h3>👁️ Our Vision</h3>
                            <p>
                                To become Turkey's most preferred personnel tracking and productivity management platform. To provide innovative solutions to
                                the business world with Web3 technologies.
                            </p>
                        </div>

                        <div className="info-card">
                            <h3>💎 Our Values</h3>
                            <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
                                <li>Reliability and Transparency</li>
                                <li>Innovation and Technology</li>
                                <li>Customer Satisfaction</li>
                                <li>Data Security</li>
                            </ul>
                        </div>
                    </div>
                    <br />
                    <div className="chart-card full-width">
                        <h3>🏆 Why TeamPro?</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🔐</div>
                                <div className="stat-info">
                                    <h3 className="stat-value">Blockchain</h3>
                                    <p className="stat-title">Secure Infrastructure</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⚡</div>
                                <div className="stat-info">
                                    <h3 className="stat-value">Real-Time</h3>
                                    <p className="stat-title">Instant Tracking</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-info">
                                    <h3 className="stat-value">Detailed Analysis</h3>
                                    <p className="stat-title">Reporting</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎨</div>
                                <div className="stat-info">
                                    <h3 className="stat-value">Modern Interface</h3>
                                    <p className="stat-title">User Friendly</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
