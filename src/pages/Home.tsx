import useScrollAnimation from "../hooks/useScrollAnimation";
import "../styles/Home.css";

function Home() {
    useScrollAnimation();
    return (
        <div className="home-page fade-in">
            {/* Animated Background */}
            <div className="animated-background" aria-hidden="true">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
                <div className="floating-shape shape-4"></div>
                <div className="floating-shape shape-5"></div>
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
                {/* Decorative sparkles — positioned to feel organic */}
                <div className="sparkle" style={{ top: '12%', left: '22%', animationDuration: '8s', animationDelay: '0s' }}></div>
                <div className="sparkle" style={{ top: '38%', left: '8%', animationDuration: '10s', animationDelay: '1s' }}></div>
                <div className="sparkle" style={{ top: '20%', left: '70%', animationDuration: '9s', animationDelay: '0.1s' }}></div>
                <div className="sparkle" style={{ top: '64%', left: '45%', animationDuration: '11s', animationDelay: '0.3s' }}></div>
                <div className="sparkle" style={{ top: '30%', left: '40%', animationDuration: '7s', animationDelay: '0.5s' }}></div>
                <div className="sparkle" style={{ top: '85%', left: '12%', animationDuration: '9s', animationDelay: '0.7s' }}></div>
                <div className="sparkle" style={{ top: '8%', left: '82%', animationDuration: '12s', animationDelay: '0.2s' }}></div>
                <div className="sparkle" style={{ top: '55%', left: '82%', animationDuration: '7s', animationDelay: '1.5s' }}></div>
                <div className="sparkle" style={{ top: '72%', left: '58%', animationDuration: '9s', animationDelay: '2s' }}></div>
                <div className="sparkle" style={{ top: '40%', left: '28%', animationDuration: '10s', animationDelay: '1s' }}></div>
            </div>

            <section className="home-hero">
                <div className="fade-in-up hero-card-wrapper">
                    <div className="hero-card">
                    <h1>Transparent Factory Tracking, powered by Sui</h1>
                    <p>Secure, real-time entry, machines and shift tracking — built to scale for teams and factories.</p>
                    <div className="cta-buttons">
                        <button className="btn btn-primary">Get Started</button>
                        <button className="btn btn-secondary">Learn More</button>
                    </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2 className="features-title fade-in-up">Powerful Features</h2>
                <div className="features-grid">
                    <div className="feature-card card fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="icon icon-card-access">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.79-2.931 9.563M12 11c0-3.517.99-6.79 2.93-9.563m-2.93 9.563H9.07a2.982 2.982 0 01-2.931-2.931V9.07a2.982 2.982 0 012.93-2.93h2.931m-2.931 9.563a2.982 2.982 0 002.93 2.93h2.93a2.982 2.982 0 002.931-2.93V9.07a2.982 2.982 0 00-2.93-2.93h-2.931" /></svg>
                        </div>
                        <h3>Card Access</h3>
                        <p>Fast and secure personnel entry-exit tracking with RFID card reader.</p>
                    </div>
                    <div className="feature-card card fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="icon icon-time">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3>Time Tracking</h3>
                        <p>Detailed working hours, shift and active time analysis.</p>
                    </div>
                    <div className="feature-card card fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="icon icon-reports">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <h3>Real-Time Reports</h3>
                        <p>Instant personnel status, department-based statistics and charts.</p>
                    </div>
                     <div className="feature-card card fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="icon icon-productivity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <h3>Productivity Analysis</h3>
                        <p>Individual and team performance metrics, goal tracking.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
