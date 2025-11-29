import "../styles/Dashboard.css";

function Services() {
    const services = [
        {
            icon: "🔐",
            title: "Card Access System",
            description: "Fast and secure personnel entry-exit tracking with RFID card reader",
            features: ["Automatic registration", "Fast passage", "Secure verification", "Multiple door support"],
        },
        {
            icon: "⏱️",
            title: "Time Management",
            description: "Detailed working hours, shift and active time analysis",
            features: ["Shift tracking", "Overtime calculation", "Leave management", "Shift planning"],
        },
        {
            icon: "📊",
            title: "Reporting and Analysis",
            description: "Instant personnel status, department-based statistics and charts",
            features: ["Daily reports", "Weekly analysis", "Monthly summaries", "Excel exports"],
        },
        {
            icon: "📈",
            title: "Productivity Tracking",
            description: "Individual and team performance metrics, goal tracking",
            features: ["KPI tracking", "Goal setting", "Performance analysis", "Comparisons"],
        },
        {
            icon: "⚙️",
            title: "Machine Management",
            description: "Machine and resource usage tracking, efficiency analysis",
            features: ["Usage times", "Production tracking", "Maintenance schedules", "Efficiency rates"],
        },
        {
            icon: "🏆",
            title: "Reward System",
            description: "Increase employee motivation with gamification",
            features: ["Point system", "Achievement badges", "Leaderboard", "Incentive program"],
        },
        {
            icon: "🔔",
            title: "Notification System",
            description: "Instant notifications for important events",
            features: ["Entry/Exit notifications", "Shift alerts", "Goal notifications", "System alerts"],
        },
        {
            icon: "🌐",
            title: "Web3 Integration",
            description: "Blockchain-based secure data management",
            features: ["Sui blockchain", "Crypto wallet", "Immutable records", "Smart contracts"],
        },
    ];

    return (
        <div className="dashboard-main">
            <div className="dashboard-content">
                <div className="content-header">
                    <h1>Our Services</h1>
                    <p>Comprehensive solutions we offer with TeamPro</p>
                </div>

                <div
                    className="services-grid"
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "24px" }}
                >
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="chart-card"
                            style={{ padding: "24px", transition: "transform 0.3s ease", cursor: "pointer" }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                            <div style={{ fontSize: "3em", marginBottom: "16px" }}>{service.icon}</div>
                            <h3 style={{ marginBottom: "12px", color: "#667eea" }}>{service.title}</h3>
                            <p style={{ marginBottom: "16px", lineHeight: "1.6", opacity: 0.8 }}>{service.description}</p>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {service.features.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        style={{
                                            padding: "8px 0",
                                            borderBottom: idx < service.features.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                                        }}
                                    >
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="chart-card full-width" style={{ marginTop: "32px" }}>
                    <h2>📋 Package Options</h2>
                    <div className="stats-grid">
                        <div className="stat-card" style={{ flexDirection: "column", alignItems: "flex-start", padding: "24px" }}>
                            <h3 style={{ color: "#667eea" }}>Basic</h3>
                            <div style={{ fontSize: "2em", margin: "16px 0" }}>
                                $99<span style={{ fontSize: "0.5em", opacity: 0.7 }}>/mo</span>
                            </div>
                            <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
                                <li>✓ 50 Personnel</li>
                                <li>✓ Basic Reports</li>
                                <li>✓ 3 Door Access</li>
                                <li>✓ Email Support</li>
                            </ul>
                        </div>

                        <div className="stat-card" style={{ flexDirection: "column", alignItems: "flex-start", padding: "24px", border: "2px solid #667eea" }}>
                            <h3 style={{ color: "#667eea" }}>Pro ⭐</h3>
                            <div style={{ fontSize: "2em", margin: "16px 0" }}>
                                $199<span style={{ fontSize: "0.5em", opacity: 0.7 }}>/mo</span>
                            </div>
                            <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
                                <li>✓ 200 Personnel</li>
                                <li>✓ All Reports</li>
                                <li>✓ Unlimited Doors</li>
                                <li>✓ Priority Support</li>
                                <li>✓ Reward System</li>
                            </ul>
                        </div>

                        <div className="stat-card" style={{ flexDirection: "column", alignItems: "flex-start", padding: "24px" }}>
                            <h3 style={{ color: "#667eea" }}>Enterprise</h3>
                            <div style={{ fontSize: "2em", margin: "16px 0" }}>Custom Price</div>
                            <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
                                <li>✓ Unlimited Personnel</li>
                                <li>✓ Custom Integrations</li>
                                <li>✓ Custom Development</li>
                                <li>✓ 24/7 Support</li>
                                <li>✓ Training & Consulting</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Services;
