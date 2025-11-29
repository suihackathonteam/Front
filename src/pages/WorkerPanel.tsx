import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useWorkerCard, useIdentityTransaction, useIdentityEvents, useWorkerAwardHistory } from "../hooks/useIdentity";
import { buildClockInOutTx } from "../utils/transactions";
import { ACTION_TYPES, CONTRACT_CONFIG } from "../config/contracts";
import SuiConnectButton from "../components/SuiConnectButton";
import "../styles/WorkerPanel.css";

function WorkerPanel() {
    const account = useCurrentAccount();
    const { workerCard, loading: cardLoading } = useWorkerCard();
    const { executeTransaction, isLoading: txLoading } = useIdentityTransaction();
    const { events: doorEvents } = useIdentityEvents("DoorAccessEvent");
    const { events: machineEvents } = useIdentityEvents("MachineUsageEvent");
    const { events: clockEvents } = useIdentityEvents("ClockEvent");
    const { events: awardEvents } = useIdentityEvents("AwardEvent");

    // Fetch award history from worker card
    const { awardHistory, totalAwardPoints } = useWorkerAwardHistory(workerCard?.id);

    // Get door entries from localStorage
    const [localDoorEntries, setLocalDoorEntries] = useState<any[]>([]);

    useEffect(() => {
        const loadDoorEntries = () => {
            const entries = JSON.parse(localStorage.getItem("doorEntries") || "[]");
            setLocalDoorEntries(entries);
        };

        loadDoorEntries();
        // Refresh every second to show updates
        const interval = setInterval(loadDoorEntries, 1000);
        return () => clearInterval(interval);
    }, []);

    // Combine blockchain events and local entries
    const allDoorEvents = [...doorEvents, ...localDoorEntries];

    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<"info" | "activity" | "awards">("info");
    const [shiftActive, setShiftActive] = useState(() => {
        const saved = localStorage.getItem("shiftActive");
        return saved === "true";
    });
    const [localProductionCount, setLocalProductionCount] = useState(() => {
        const saved = localStorage.getItem("localProductionCount");
        return saved ? parseInt(saved, 10) : 0;
    });
    const [shiftStartTime, setShiftStartTime] = useState<number | null>(() => {
        const saved = localStorage.getItem("shiftStartTime");
        return saved ? parseInt(saved, 10) : null;
    });
    const [currentWorkTime, setCurrentWorkTime] = useState(0);

    // Live work time counter
    useEffect(() => {
        let interval: number | null = null;

        if (shiftActive && shiftStartTime) {
            interval = window.setInterval(() => {
                const elapsed = Date.now() - shiftStartTime;
                setCurrentWorkTime(elapsed);
            }, 1000); // Update every second
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [shiftActive, shiftStartTime]);

    // Persist shift state to localStorage
    useEffect(() => {
        localStorage.setItem("shiftActive", String(shiftActive));
    }, [shiftActive]);

    useEffect(() => {
        if (shiftStartTime !== null) {
            localStorage.setItem("shiftStartTime", String(shiftStartTime));
        } else {
            localStorage.removeItem("shiftStartTime");
        }
    }, [shiftStartTime]);

    useEffect(() => {
        localStorage.setItem("localProductionCount", String(localProductionCount));
    }, [localProductionCount]);

    if (!account) {
        return (
            <div className="worker-container">
                <div className="worker-connect">
                    <h2>👤 Worker Panel</h2>
                    <p>Please connect your wallet to access the panel</p>
                    <SuiConnectButton />
                </div>
            </div>
        );
    }

    if (cardLoading) {
        return (
            <div className="worker-container">
                <div className="worker-loading">
                    <div className="spinner"></div>
                    <p>Checking Worker Card...</p>
                </div>
            </div>
        );
    }

    if (!workerCard) {
        return (
            <div className="worker-container">
                <div className="worker-no-card">
                    <h2>⚠️ Worker Card Not Found</h2>
                    <p>No Worker Card has been created for this address yet.</p>
                    <p className="address-info">
                        Connected address: <code>{account.address}</code>
                    </p>
                    <p>Please request a Worker Card from the system administrator.</p>
                </div>
            </div>
        );
    }

    if (!workerCard.is_active) {
        return (
            <div className="worker-container">
                <div className="worker-no-card">
                    <h2>🚫 Worker Card Disabled</h2>
                    <p>Your card has been disabled by the system administrator.</p>
                    <p className="address-info">
                        Connected address: <code>{account.address}</code>
                    </p>
                    <p>Please contact the system administrator for more information.</p>
                </div>
            </div>
        );
    }

    const handleClockIn = async () => {
        // Prevent starting a new shift if one is already active
        if (shiftActive) {
            alert("⚠️ A shift is already active! Please end your current shift first.");
            return;
        }

        const tx = buildClockInOutTx(workerCard.id, CONTRACT_CONFIG.SYSTEM_REGISTRY_ID, ACTION_TYPES.CLOCK_IN);
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                // enable local production counting when clock-in succeeds
                const startTime = Date.now();
                setShiftActive(true);
                setLocalProductionCount(0);
                setShiftStartTime(startTime);
                setCurrentWorkTime(0);
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const handleClockOut = async () => {
        if (!shiftActive) {
            alert("⚠️ No active shift found!");
            return;
        }

        const tx = buildClockInOutTx(workerCard.id, CONTRACT_CONFIG.SYSTEM_REGISTRY_ID, ACTION_TYPES.CLOCK_OUT);
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                // disable local production counting on clock-out
                setShiftActive(false);
                setShiftStartTime(null);
                setCurrentWorkTime(0);
                localStorage.removeItem("shiftActive");
                localStorage.removeItem("shiftStartTime");
                localStorage.removeItem("localProductionCount");
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const handleIncreaseProduction = () => {
        if (!shiftActive) return;
        setLocalProductionCount((c) => c + 1);
    };

    const handleDoorEntry = async () => {
        // Save to localStorage instead of blockchain
        const entry = {
            worker_address: account.address,
            door_id: 0,
            door_name: "Main Entrance",
            timestamp: Date.now(),
            is_entry: true,
        };

        const existingEntries = JSON.parse(localStorage.getItem("doorEntries") || "[]");
        existingEntries.unshift(entry);
        localStorage.setItem("doorEntries", JSON.stringify(existingEntries.slice(0, 50)));

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleDoorExit = async () => {
        // Save to localStorage instead of blockchain
        const exit = {
            worker_address: account.address,
            door_id: 0,
            door_name: "Main Entrance",
            timestamp: Date.now(),
            is_entry: false,
        };

        const existingEntries = JSON.parse(localStorage.getItem("doorEntries") || "[]");
        existingEntries.unshift(exit);
        localStorage.setItem("doorEntries", JSON.stringify(existingEntries.slice(0, 50)));

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const formatWorkHours = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}s ${minutes}d ${seconds}sn`;
    };

    return (
        <div className="worker-container">
            <div className="worker-header">
                <div className="worker-title">
                    <h1>👤 Worker Panel</h1>
                    <p>
                        {workerCard.name} - {workerCard.department}
                    </p>
                </div>
                <div className="quick-actions">
                    <button
                        className="clock-btn clock-in"
                        onClick={handleClockIn}
                        disabled={txLoading || shiftActive}
                        title={shiftActive ? "A shift is already active" : "Start shift"}
                    >
                        🕐 Start Shift
                    </button>
                    <button
                        className="clock-btn clock-out"
                        onClick={handleClockOut}
                        disabled={txLoading || !shiftActive}
                        title={!shiftActive ? "No active shift" : "End shift"}
                    >
                        🕐 End Shift
                    </button>
                    <button className="prod-btn" onClick={handleIncreaseProduction} disabled={!shiftActive || txLoading}>
                        ➕ Add Product
                    </button>
                    <button className="door-btn door-entry" onClick={handleDoorEntry}>
                        🚪 Entry
                    </button>
                    <button className="door-btn door-exit" onClick={handleDoorExit}>
                        🚪 Exit
                    </button>
                </div>
            </div>

            {showSuccess && <div className="success-banner">✓ Transaction successfully recorded!</div>}

            <div className="worker-tabs">
                <button className={activeTab === "info" ? "tab-active" : ""} onClick={() => setActiveTab("info")}>
                    📋 My Information
                </button>
                <button className={activeTab === "activity" ? "tab-active" : ""} onClick={() => setActiveTab("activity")}>
                    📊 Activities
                </button>
                <button className={activeTab === "awards" ? "tab-active" : ""} onClick={() => setActiveTab("awards")}>
                    🏆 Awards ({totalAwardPoints})
                </button>
            </div>

            <div className="worker-content">
                {activeTab === "info" && (
                    <div className="info-grid">
                        <div className="info-card">
                            <h3>👤 Personal Information</h3>
                            <div className="info-row">
                                <span className="label">Card No:</span>
                                <span className="value">{workerCard.card_number}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Full Name:</span>
                                <span className="value">{workerCard.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Department:</span>
                                <span className="value">{workerCard.department}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Address:</span>
                                <span className="value address">
                                    {workerCard.worker_address.slice(0, 8)}...{workerCard.worker_address.slice(-6)}
                                </span>
                            </div>
                        </div>

                        <div className="info-card">
                            <h3>📊 Statistics</h3>
                            <div className="stat-box">
                                <span className="stat-icon">🕐</span>
                                <div className="stat-details">
                                    <span className="stat-label">Total Working Hours</span>
                                    <span className="stat-value">
                                        {shiftActive ? formatWorkHours(currentWorkTime) : formatWorkHours(workerCard.total_work_hours)}
                                    </span>
                                    {shiftActive && <div className="stat-small live-indicator">🔴 Live - Shift Active</div>}
                                </div>
                            </div>
                            <div className="stat-box">
                                <span className="stat-icon">📦</span>
                                <div className="stat-details">
                                    <span className="stat-label">Total Production</span>
                                    <span className="stat-value">{workerCard.total_production} items</span>
                                    {localProductionCount > 0 && <div className="stat-small">Session additions: {localProductionCount} items</div>}
                                </div>
                            </div>
                            <div className="stat-box">
                                <span className="stat-icon">⚡</span>
                                <div className="stat-details">
                                    <span className="stat-label">Efficiency Score</span>
                                    <span className="stat-value">{workerCard.efficiency_score}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "activity" && (
                    <div className="activity-section">
                        <div className="activity-card">
                            <h3>🚪 Door Access</h3>
                            <div className="activity-list">
                                {allDoorEvents.length === 0 ? (
                                    <p className="no-data">No door access records yet</p>
                                ) : (
                                    allDoorEvents.slice(0, 10).map((event, i) => {
                                        // Check if it's a localStorage entry or blockchain event
                                        const isLocalEntry = !event.parsedJson;
                                        const data = isLocalEntry ? event : (event.parsedJson as any);

                                        // Decode door_name safely
                                        let doorName = "Unknown Door";
                                        try {
                                            if (data.door_name) {
                                                doorName =
                                                    typeof data.door_name === "string"
                                                        ? data.door_name
                                                        : new TextDecoder().decode(new Uint8Array(data.door_name));
                                            }
                                        } catch (e) {
                                            doorName = `Door ${data.door_id || 0}`;
                                        }

                                        const timestamp = isLocalEntry ? data.timestamp : Number(data.timestamp);
                                        const isEntry = data.is_entry;

                                        return (
                                            <div key={`door-${i}-${timestamp}`} className="activity-item">
                                                <span className="activity-icon">{isEntry ? "➡️" : "⬅️"}</span>
                                                <div className="activity-details">
                                                    <span className="activity-title">{doorName}</span>
                                                    <span className="activity-time">{new Date(timestamp).toLocaleString("tr-TR")}</span>
                                                </div>
                                                <span className={`activity-badge ${isEntry ? "entry" : "exit"}`}>{isEntry ? "Entry" : "Exit"}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="activity-card">
                            <h3>⚙️ Machine Usage</h3>
                            <div className="activity-list">
                                {machineEvents.length === 0 ? (
                                    <p className="no-data">No machine usage records yet</p>
                                ) : (
                                    machineEvents.slice(0, 10).map((event, i) => {
                                        const data = event.parsedJson as any;
                                        // Decode machine_name safely
                                        let machineName = "Unknown Machine";
                                        try {
                                            if (data.machine_name) {
                                                machineName =
                                                    typeof data.machine_name === "string"
                                                        ? data.machine_name
                                                        : new TextDecoder().decode(new Uint8Array(data.machine_name));
                                            }
                                        } catch (e) {
                                            machineName = `Machine ${data.machine_id || 0}`;
                                        }

                                        return (
                                            <div key={i} className="activity-item">
                                                <span className="activity-icon">⚙️</span>
                                                <div className="activity-details">
                                                    <span className="activity-title">{machineName}</span>
                                                    <span className="activity-subtitle">
                                                        Production: {data.production_count || 0} | Efficiency: {data.efficiency_percentage || 0}%
                                                    </span>
                                                    <span className="activity-time">{new Date(Number(data.timestamp)).toLocaleString("tr-TR")}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="activity-card">
                            <h3>🕐 Shift Records</h3>
                            <div className="activity-list">
                                {clockEvents.length === 0 ? (
                                    <p className="no-data">No shift records yet</p>
                                ) : (
                                    clockEvents.slice(0, 10).map((event, i) => {
                                        const data = event.parsedJson as any;
                                        const isClockIn = data.action_type === 0 || data.action_type === "0";

                                        return (
                                            <div key={i} className="activity-item">
                                                <span className="activity-icon">{isClockIn ? "🕐" : "🏁"}</span>
                                                <div className="activity-details">
                                                    <span className="activity-title">{isClockIn ? "Shift Start" : "Shift End"}</span>
                                                    <span className="activity-time">{new Date(Number(data.timestamp)).toLocaleString("tr-TR")}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "awards" && (
                    <div className="tab-content">
                        <div className="award-summary">
                            <div className="award-stats">
                                <div className="stat-card">
                                    <span className="stat-label">Total Points</span>
                                    <span className="stat-value">{totalAwardPoints}</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-label">Awards Received</span>
                                    <span className="stat-value">{awardHistory.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="activity-card">
                            <h3>🏆 Award History</h3>
                            <div className="activity-list">
                                {awardHistory.length === 0 ? (
                                    <p className="no-data">No awards yet. Keep up the good work! 💪</p>
                                ) : (
                                    awardHistory.map((award: any, i: number) => {
                                        const awardType =
                                            typeof award.award_type === "string"
                                                ? award.award_type
                                                : new TextDecoder().decode(new Uint8Array(award.award_type));
                                        const description =
                                            typeof award.description === "string"
                                                ? award.description
                                                : new TextDecoder().decode(new Uint8Array(award.description));

                                        return (
                                            <div key={i} className="award-item">
                                                <div className="award-icon">🏅</div>
                                                <div className="award-details">
                                                    <span className="award-type">{awardType}</span>
                                                    <span className="award-description">{description}</span>
                                                    <span className="award-date">{new Date(Number(award.timestamp_ms)).toLocaleString("tr-TR")}</span>
                                                </div>
                                                <span className="award-points">+{award.points}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {awardEvents.length > 0 && (
                            <div className="activity-card">
                                <h3>📢 Recent Award Events</h3>
                                <div className="activity-list">
                                    {awardEvents.slice(0, 10).map((event, i) => {
                                        const data = event.parsedJson as any;
                                        const awardType =
                                            typeof data.award_type === "string" ? data.award_type : new TextDecoder().decode(new Uint8Array(data.award_type));

                                        return (
                                            <div key={i} className="activity-item">
                                                <span className="activity-icon">🎁</span>
                                                <div className="activity-details">
                                                    <span className="activity-title">{awardType}</span>
                                                    <span className="activity-subtitle">Points: {data.points}</span>
                                                    <span className="activity-time">{new Date(Number(data.timestamp_ms)).toLocaleString("tr-TR")}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkerPanel;
