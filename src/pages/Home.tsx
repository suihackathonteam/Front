import "../styles/Home.css";

function Home() {
    return (
        <div className="home-container">
            <main className="main-content">
                <div className="hero-section">
                    <h1>Personnel Tracking System</h1>
                    <p className="hero-subtitle">Monitor employee activities with card access system, perform productivity analysis</p>

                    <div className="features-grid">
                        <div className="feature-box">
                            <div className="feature-icon">🔐</div>
                            <h3>Card Access</h3>
                            <p>Fast and secure personnel entry-exit tracking with RFID card reader</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon">⏱️</div>
                            <h3>Time Tracking</h3>
                            <p>Detailed working hours, shift and active time analysis</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon">📊</div>
                            <h3>Real-Time Reports</h3>
                            <p>Instant personnel status, department-based statistics and charts</p>
                        </div>
                        <div className="feature-box">
                            <div className="feature-icon">📈</div>
                            <h3>Productivity Analysis</h3>
                            <p>Individual and team performance metrics, goal tracking</p>
                        </div>
                    </div>
                </div>
                <div className="info-section">
                    <h2>System Features</h2>
                    <div className="info-grid">
                        <div className="info-card">
                            <h4>🎯 Comprehensive Tracking</h4>
                            <ul>
                                <li>Automatic entry recording with card tap</li>
                                <li>Real-time location information</li>
                                <li>Department-based activity monitoring</li>
                                <li>Weekly and monthly work reports</li>
                            </ul>
                        </div>
                        <div className="info-card">
                            <h4>📱 Easy Management</h4>
                            <ul>
                                <li>Web-based management panel</li>
                                <li>Mobile-friendly interface</li>
                                <li>Automatic notifications</li>
                                <li>Flexible report outputs</li>
                            </ul>
                        </div>
                        <div className="info-card">
                            <h4>🔒 Security</h4>
                            <ul>
                                <li>Blockchain-based data security</li>
                                <li>Sui network integration</li>
                                <li>Encrypted data transmission</li>
                                <li>Authorization system</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;
