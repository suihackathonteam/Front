import useScrollAnimation from "../hooks/useScrollAnimation";
import "../styles/Home.css";

function Services() {
    useScrollAnimation();
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
        <div className="fade-in home-page" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="animated-background" aria-hidden="true">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
                <div className="floating-shape shape-4"></div>
                <div className="floating-shape shape-5"></div>
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
                <div className="sparkle" style={{ top: '12%', left: '22%', animationDuration: '8s', animationDelay: '0s' }}></div>
                <div className="sparkle" style={{ top: '38%', left: '8%', animationDuration: '10s', animationDelay: '1s' }}></div>
                <div className="sparkle" style={{ top: '20%', left: '70%', animationDuration: '9s', animationDelay: '0.1s' }}></div>
            </div>
            <div className="page-header">
                <div className="hero-card-wrapper fade-in-up">
                    <div className="hero-card">
                        <h1>Our Services</h1>
                        <p>Comprehensive solutions we offer with TeamPro</p>
                    </div>
                </div>
            </div>

            <div
                style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", 
                    gap: "1.5rem", 
                    marginTop: "2rem" 
                }}
            >
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="card"
                        style={{ 
                            padding: "2rem", 
                            transition: "transform 0.3s ease, box-shadow 0.3s ease", 
                            cursor: "pointer",
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "";
                        }}
                    >
                        <div style={{ fontSize: "3em", marginBottom: "1rem" }}>{service.icon}</div>
                        <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)", fontSize: '1.25rem' }}>{service.title}</h3>
                        <p style={{ marginBottom: "1.5rem", lineHeight: "1.6", color: 'var(--text-color-secondary)', flex: 1 }}>{service.description}</p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {service.features.map((feature, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        padding: "0.5rem 0",
                                        borderBottom: idx < service.features.length - 1 ? "1px solid var(--border-color)" : "none",
                                        fontSize: '0.95rem',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    ✓ {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Services;
