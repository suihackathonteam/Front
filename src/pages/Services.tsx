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
        <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="page-header">
                <h1>Our Services</h1>
                <p>Comprehensive solutions we offer with TeamPro</p>
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

            <div className="card" style={{ marginTop: "3rem", padding: '2rem' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>📋 Package Options</h2>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
                    gap: '2rem' 
                }}>
                    <div className="card" style={{ padding: "2rem", textAlign: 'center' }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: '1rem' }}>Basic</h3>
                        <div style={{ fontSize: "2.5em", margin: "1rem 0", fontWeight: 'bold', color: 'var(--text-color)' }}>
                            $99<span style={{ fontSize: "0.4em", opacity: 0.7, fontWeight: 'normal' }}>/mo</span>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, textAlign: 'left', marginTop: '1.5rem' }}>
                            <li style={{ padding: '0.5rem 0' }}>✓ 50 Personnel</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ Basic Reports</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ 3 Door Access</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ Email Support</li>
                        </ul>
                    </div>

                    <div className="card" style={{ padding: "2rem", border: "2px solid var(--primary-color)", textAlign: 'center', position: 'relative' }}>
                        <div style={{ 
                            position: 'absolute', 
                            top: '-12px', 
                            right: '20px', 
                            background: 'var(--primary-color)', 
                            color: 'white', 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                        }}>POPULAR</div>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: '1rem' }}>Pro ⭐</h3>
                        <div style={{ fontSize: "2.5em", margin: "1rem 0", fontWeight: 'bold', color: 'var(--text-color)' }}>
                            $199<span style={{ fontSize: "0.4em", opacity: 0.7, fontWeight: 'normal' }}>/mo</span>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, textAlign: 'left', marginTop: '1.5rem' }}>
                            <li style={{ padding: '0.5rem 0' }}>✓ 200 Personnel</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ All Reports</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ Unlimited Doors</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ Priority Support</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ Reward System</li>
                        </ul>
                    </div>

                    <div className="card" style={{ padding: "2rem", textAlign: 'center' }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: '1rem' }}>Enterprise</h3>
                        <div style={{ fontSize: "1.75em", margin: "1rem 0", fontWeight: 'bold', color: 'var(--text-color)' }}>Custom Price</div>
                        <ul style={{ listStyle: "none", padding: 0, textAlign: 'left', marginTop: '1.5rem' }}>
                            <li style={{ padding: '0.5rem 0' }}>✓ Unlimited Personnel</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ Custom Integrations</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ Custom Development</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ 24/7 Support</li>
                            <li style={{ padding: '0.5rem 0' }}>✓ Training & Consulting</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Services;
