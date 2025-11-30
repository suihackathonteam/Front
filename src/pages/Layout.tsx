import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import SuiConnectButton from "../components/SuiConnectButton";
import { useAdminCap } from "../hooks/useIdentity";
import "../styles/Modern.css";

function Layout() {
    const currentAccount = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();
    const { isAdmin } = useAdminCap();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        disconnect();
        navigate("/");
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setMenuOpen(false);
    };

    return (
        <div className="app-root modern-layout">
            <header className="app-topbar">
                <div className="logo" onClick={() => navigate("/")}>
                    {!currentAccount && <h2>Team</h2>}
                    {currentAccount && <h2>TeamPro</h2>}
                </div>

                <nav className={`dashboard-nav ${menuOpen ? "open" : ""}`}>
                    <a onClick={() => handleNavigate("/")}>Home</a>
                    <a onClick={() => handleNavigate("/about")}>About</a>
                    <a onClick={() => handleNavigate("/services")}>Services</a>
                    {currentAccount && (
                        <>
                            <a onClick={() => handleNavigate("/dashboard")}>Dashboard</a>
                            <a onClick={() => handleNavigate("/worker")}>Worker</a>
                        </>
                    )}
                    {isAdmin && (
                        <a onClick={() => handleNavigate("/admin")} style={{ color: "var(--primary-color)" }}>
                            Admin
                        </a>
                    )}
                </nav>

                <div className="user-section">
                    <SuiConnectButton />
                    {currentAccount && (
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
                
                <button 
                    className="mobile-menu-toggle" 
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            <main>
                <Outlet />
            </main>

            <footer className="dashboard-footer">
                <p>&copy; 2025 TeamPro. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Layout;
