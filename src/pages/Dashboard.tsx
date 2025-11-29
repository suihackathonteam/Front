import { useState, useEffect, useMemo } from "react";
import "../styles/Dashboard.css";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import SuiConnectButton from "../components/SuiConnectButton";
import { useIdentityEvents, useRecentDoorAccess, useRecentMachineUsage, useRecentShifts, useRecentAwards, useDoors, useMachines } from "../hooks/useIdentity";
import type { EventData } from "../types/sui";
import StatCard from "../components/dashboard/StatCard";
import DoorAccessChart from "../components/dashboard/DoorAccessChart";
import MachineUsageChart from "../components/dashboard/MachineUsageChart";
import EmployeeList from "../components/dashboard/EmployeeList";
import EmployeeDetailView from "../components/dashboard/EmployeeDetailView";
import DoorGrid from "../components/dashboard/DoorGrid";
import MachineGrid from "../components/dashboard/MachineGrid";
import LoadingSpinner from "../components/shared/LoadingSpinner";

// Helper to check if event has necessary data
function isValidEvent(event: unknown): event is EventData {
    return typeof event === "object" && event !== null && "parsedJson" in event && typeof (event as EventData).parsedJson === "object";
}

function Dashboard() {
    const [selectedView, setSelectedView] = useState("overview");
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const currentAccount = useCurrentAccount();
    const client = useSuiClient();

    const { events: allEvents, loading: eventsLoading } = useIdentityEvents("*");

    // Fetch global activity data from registry
    const { recentDoorAccess } = useRecentDoorAccess();
    const { recentMachineUsage } = useRecentMachineUsage();
    const { recentShifts } = useRecentShifts();
    const { recentAwards } = useRecentAwards();
    const { doors, loading: doorsLoading } = useDoors();
    const { machines, loading: machinesLoading } = useMachines();

    const [workerCards, setWorkerCards] = useState<
        Array<{
            id: string;
            worker_address: string;
            card_number: string;
            name: string;
            department: string;
            is_active: boolean;
            total_work_hours: number;
            total_production: number;
            efficiency_score: number;
            event_count: number;
        }>
    >([]);
    const [loadingCards, setLoadingCards] = useState(true);

    const parsedEvents = useMemo(() => {
        interface DoorEvent {
            worker_address: string;
            card_number: unknown;
            door_id: number;
            door_name: unknown;
            access_type: number;
            timestamp: Date;
            is_entry: boolean;
        }
        interface MachineEvent {
            worker_address: string;
            card_number: unknown;
            machine_id: number;
            machine_name: unknown;
            timestamp: Date;
            duration: number;
            production_count: number;
            efficiency: number;
        }
        interface ClockEvent {
            worker_address: string;
            card_number: unknown;
            timestamp: Date;
            action_type: number;
        }
        interface AwardEvent {
            worker_address: string;
            card_number: unknown;
            award_type: unknown;
            points: number;
            description: unknown;
            timestamp: Date;
        }

        const doorEvents: DoorEvent[] = [];
        const machineEvents: MachineEvent[] = [];
        const clockEvents: ClockEvent[] = [];
        const awardEvents: AwardEvent[] = [];

        allEvents.forEach((event) => {
            try {
                if (!isValidEvent(event) || !event.type) return;
                const eventType = event.type.split("::").pop();
                const parsedJson = event.parsedJson;

                if (eventType === "DoorAccessEvent") {
                    doorEvents.push({
                        worker_address: String(parsedJson?.worker_address || ""),
                        card_number: parsedJson?.card_number,
                        door_id: Number(parsedJson?.door_id),
                        door_name: parsedJson?.door_name,
                        access_type: Number(parsedJson?.access_type),
                        timestamp: new Date(Number(parsedJson?.timestamp_ms || 0)),
                        is_entry: Number(parsedJson?.access_type) === 2, // 2 = entry, 3 = exit
                    });
                } else if (eventType === "MachineUsageEvent") {
                    machineEvents.push({
                        worker_address: String(parsedJson?.worker_address || ""),
                        card_number: parsedJson?.card_number,
                        machine_id: Number(parsedJson?.machine_id),
                        machine_name: parsedJson?.machine_name,
                        timestamp: new Date(Number(parsedJson?.timestamp_ms || 0)),
                        duration: Number(parsedJson?.usage_duration_ms),
                        production_count: Number(parsedJson?.production_count),
                        efficiency: Number(parsedJson?.efficiency_percentage),
                    });
                } else if (eventType === "ClockEvent") {
                    clockEvents.push({
                        worker_address: String(parsedJson?.worker_address || ""),
                        card_number: parsedJson?.card_number,
                        timestamp: new Date(Number(parsedJson?.timestamp_ms || 0)),
                        action_type: Number(parsedJson?.action_type),
                    });
                } else if (eventType === "AwardEvent") {
                    awardEvents.push({
                        worker_address: String(parsedJson?.worker_address || ""),
                        card_number: parsedJson?.card_number,
                        award_type: parsedJson?.award_type,
                        points: Number(parsedJson?.points),
                        description: parsedJson?.description,
                        timestamp: new Date(Number(parsedJson?.timestamp_ms || 0)),
                    });
                }
            } catch (err) {
                console.warn("Event parse error:", err, event);
            }
        });

        return { doorEvents, machineEvents, clockEvents, awardEvents };
    }, [allEvents]);

    // Fetch worker cards from blockchain
    useEffect(() => {
        const fetchWorkerCards = async () => {
            if (!currentAccount) {
                setLoadingCards(false);
                return;
            }

            try {
                setLoadingCards(true);

                // For now, build worker cards from events
                // This is a fallback approach since WorkerCards are not stored in registry
                const uniqueWorkers = new Map<
                    string,
                    {
                        id: string;
                        worker_address: string;
                        card_number: string;
                        name: string;
                        department: string;
                        is_active: boolean;
                        total_work_hours: number;
                        total_production: number;
                        efficiency_score: number;
                        event_count: number;
                    }
                >();

                // Process all events to build worker profiles
                allEvents.forEach((event) => {
                    try {
                        if (!isValidEvent(event)) return;
                        const parsedJson = event.parsedJson;
                        const address = String(parsedJson?.worker_address || "");

                        if (!address) return;

                        if (!uniqueWorkers.has(address)) {
                            // Decode card_number and create initial profile
                            let cardNumber = "N/A";
                            try {
                                if (parsedJson?.card_number) {
                                    if (typeof parsedJson.card_number === "string") {
                                        cardNumber = parsedJson.card_number;
                                    } else if (Array.isArray(parsedJson.card_number)) {
                                        cardNumber = new TextDecoder().decode(new Uint8Array(parsedJson.card_number));
                                    }
                                }
                            } catch (e) {
                                console.warn("Card number decode error:", e);
                            }

                            uniqueWorkers.set(address, {
                                id: address,
                                worker_address: address,
                                card_number: cardNumber,
                                name: cardNumber,
                                department: "General",
                                is_active: true,
                                total_work_hours: 0,
                                total_production: 0,
                                efficiency_score: 0,
                                event_count: 0,
                            });
                        }

                        const worker = uniqueWorkers.get(address);
                        if (!worker) return;
                        worker.event_count++;

                        // Update stats based on event type
                        if (!isValidEvent(event) || !event.type) return;
                        const eventType = event.type.split("::").pop();
                        if (eventType === "MachineUsageEvent") {
                            worker.total_work_hours += Number(parsedJson?.usage_duration_ms || 0);
                            worker.total_production += Number(parsedJson?.production_count || 0);
                            const efficiency = Number(parsedJson?.efficiency_percentage || 0);
                            // Calculate weighted average efficiency
                            if (worker.efficiency_score === 0) {
                                worker.efficiency_score = efficiency;
                            } else {
                                worker.efficiency_score = Math.round(worker.efficiency_score * 0.7 + efficiency * 0.3);
                            }
                        }
                    } catch (err) {
                        console.warn("Worker profile build error:", err);
                    }
                });

                const cards = Array.from(uniqueWorkers.values());
                setWorkerCards(cards);
            } catch (err) {
                console.error("Worker cards fetch error:", err);
            } finally {
                setLoadingCards(false);
            }
        };

        fetchWorkerCards();
    }, [currentAccount, client, allEvents]);

    const doorAccessData = useMemo(() => {
        const hourlyData: { [key: string]: { entries: number; exits: number } } = {};

        parsedEvents.doorEvents.forEach((event) => {
            const hour = event.timestamp.getHours();
            const timeKey = `${hour.toString().padStart(2, "0")}:00`;

            if (!hourlyData[timeKey]) {
                hourlyData[timeKey] = { entries: 0, exits: 0 };
            }

            if (event.is_entry) {
                hourlyData[timeKey].entries++;
            } else {
                hourlyData[timeKey].exits++;
            }
        });

        return Object.entries(hourlyData)
            .map(([time, data]) => ({ time, ...data }))
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [parsedEvents.doorEvents]);

    const machineUsageData = useMemo(() => {
        const machineStats: { [key: string]: { name: string; totalDuration: number; totalProduction: number; count: number; totalEfficiency: number } } = {};

        parsedEvents.machineEvents.forEach((event) => {
            const machineId = String(event.machine_id);

            // Decode machine name
            let machineName = `Machine ${machineId}`;
            try {
                if (event.machine_name) {
                    if (typeof event.machine_name === "string") {
                        machineName = event.machine_name;
                    } else if (Array.isArray(event.machine_name)) {
                        machineName = new TextDecoder().decode(new Uint8Array(event.machine_name));
                    }
                }
            } catch (e) {
                console.warn("Machine name decode error:", e);
            }

            if (!machineStats[machineId]) {
                machineStats[machineId] = { name: machineName, totalDuration: 0, totalProduction: 0, count: 0, totalEfficiency: 0 };
            }

            machineStats[machineId].totalDuration += event.duration || 0;
            machineStats[machineId].totalProduction += event.production_count || 0;
            machineStats[machineId].totalEfficiency += event.efficiency || 0;
            machineStats[machineId].count++;
        });

        return Object.entries(machineStats).map(([, stats]) => ({
            machine: stats.name,
            usage: (stats.totalDuration / (1000 * 3600)).toFixed(1), // Convert ms to hours
            production: stats.totalProduction,
            efficiency: stats.count > 0 ? Math.round(stats.totalEfficiency / stats.count) : 0,
        }));
    }, [parsedEvents.machineEvents]);

    const employeeAwards = useMemo(() => {
        return parsedEvents.awardEvents.slice(0, 4).map((award, index) => {
            const workerCard = workerCards.find((card) => card.worker_address === award.worker_address);

            // Decode award type
            let awardTypeText = "Award";
            try {
                if (award.award_type) {
                    if (typeof award.award_type === "string") {
                        awardTypeText = award.award_type;
                    } else if (Array.isArray(award.award_type)) {
                        awardTypeText = new TextDecoder().decode(new Uint8Array(award.award_type));
                    }
                }
            } catch (e) {
                console.warn("Award type decode error:", e);
            }

            // Decode description
            let descriptionText = "";
            try {
                if (award.description) {
                    if (typeof award.description === "string") {
                        descriptionText = award.description;
                    } else if (Array.isArray(award.description)) {
                        descriptionText = new TextDecoder().decode(new Uint8Array(award.description));
                    }
                }
            } catch (e) {
                console.warn("Description decode error:", e);
            }

            return {
                id: index + 1,
                employee: workerCard?.name || award.worker_address.slice(0, 8) + "...",
                award: `🏆 ${awardTypeText}`,
                date: award.timestamp.toLocaleDateString("tr-TR"),
                description: descriptionText || `${award.points} points award`,
                points: award.points,
            };
        });
    }, [parsedEvents.awardEvents, workerCards]);

    const realtimeStats = useMemo(() => {
        const activeWorkers = workerCards.filter((card) => card.is_active).length;
        const totalProduction = workerCards.reduce((sum, card) => sum + card.total_production, 0);

        // Count today's door entries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEntries = parsedEvents.doorEvents.filter((e) => e.timestamp >= today && e.is_entry).length;

        return [
            { icon: "👥", title: "Active Workers", value: String(activeWorkers), change: `Total: ${workerCards.length}`, color: "#667eea" },
            {
                icon: "⚙️",
                title: "Active Machines",
                value: `${machineUsageData.length}`,
                change: `${parsedEvents.machineEvents.length} uses`,
                color: "#764ba2",
            },
            {
                icon: "📦",
                title: "Total Production",
                value: String(totalProduction),
                change: `${parsedEvents.machineEvents.length} operations`,
                color: "#f093fb",
            },
            { icon: "🚪", title: "Today Entries", value: `${todayEntries}`, change: `${parsedEvents.doorEvents.length} total`, color: "#4facfe" },
        ];
    }, [workerCards, machineUsageData, parsedEvents]);

    if (!currentAccount) {
        return (
            <div className="home-container">
                <div className="cta-section">
                    <p className="cta-text">Connect your Sui wallet to access the system</p>
                    <div className="cta-button">
                        <SuiConnectButton />
                    </div>
                </div>
            </div>
        );
    }

    if (eventsLoading || loadingCards) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-main">
                    <LoadingSpinner size="large" message="Loading dashboard data..." />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="content-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h1>System Tracking Panel</h1>
                            <p>Personnel entry-exit and activity tracking</p>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button className={selectedView === "overview" ? "nav-active" : ""} onClick={() => setSelectedView("overview")}>
                                📊 Overview
                            </button>
                            <button className={selectedView === "doors" ? "nav-active" : ""} onClick={() => setSelectedView("doors")}>
                                🚪 Doors
                            </button>
                            <button className={selectedView === "machines" ? "nav-active" : ""} onClick={() => setSelectedView("machines")}>
                                ⚙️ Machines
                            </button>
                            <button className={selectedView === "employees" ? "nav-active" : ""} onClick={() => setSelectedView("employees")}>
                                👥 Employees
                            </button>
                            <button className={selectedView === "awards" ? "nav-active" : ""} onClick={() => setSelectedView("awards")}>
                                🏆 Awards
                            </button>
                            <button className={selectedView === "activity" ? "nav-active" : ""} onClick={() => setSelectedView("activity")}>
                                📢 Live Feed
                            </button>
                        </div>
                    </div>

                    {/* Real-time Stats */}
                    <div className="stats-grid">
                        {realtimeStats.map((stat, index) => (
                            <StatCard key={index} icon={stat.icon} title={stat.title} value={stat.value} change={stat.change} color={stat.color} />
                        ))}
                    </div>

                    {selectedView === "overview" && (
                        <>
                            {allEvents.length === 0 ? (
                                <div className="chart-card full-width" style={{ textAlign: "center", padding: "40px" }}>
                                    <h3>📊 No Data Yet</h3>
                                    <p style={{ color: "#b8b8b8", marginTop: "16px" }}>Real-time data will appear here when the system is in use.</p>
                                    <p style={{ color: "#b8b8b8", marginTop: "8px" }}>
                                        Create worker cards from the admin panel, add door and machine records.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Charts Section */}
                                    <div className="charts-section">
                                        <DoorAccessChart data={doorAccessData} loading={eventsLoading} />
                                        <MachineUsageChart data={machineUsageData} loading={eventsLoading} />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {selectedView === "doors" && (
                        <div className="doors-section">
                            <div className="section-header">
                                <h2>Registered Doors</h2>
                                <p>All door access points in the system</p>
                            </div>
                            <DoorGrid doors={doors} loading={doorsLoading} />
                        </div>
                    )}

                    {selectedView === "machines" && (
                        <div className="machines-section">
                            <div className="section-header">
                                <h2>Registered Machines</h2>
                                <p>All production machines in the system</p>
                            </div>
                            <MachineGrid machines={machines} loading={machinesLoading} />
                        </div>
                    )}

                    {selectedView === "employees" && (
                        <div className="employees-section">
                            <div className="section-header">
                                <h2>Employee Detailed Tracking</h2>
                            </div>

                            <EmployeeList
                                employees={workerCards}
                                clockEvents={parsedEvents.clockEvents}
                                onSelectEmployee={setSelectedEmployee}
                                selectedEmployee={selectedEmployee}
                                loading={loadingCards}
                            />

                            {selectedEmployee && (
                                <EmployeeDetailView
                                    employeeName={selectedEmployee}
                                    workerAddress={workerCards.find((w) => w.name === selectedEmployee)?.worker_address || ""}
                                    doorEvents={parsedEvents.doorEvents}
                                    machineEvents={parsedEvents.machineEvents}
                                    clockEvents={parsedEvents.clockEvents}
                                    onClose={() => setSelectedEmployee(null)}
                                />
                            )}
                        </div>
                    )}

                    {selectedView === "awards" && (
                        <div className="awards-section">
                            <div className="section-header">
                                <h2>Awards and Achievements</h2>
                            </div>

                            {employeeAwards.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "40px", color: "#b8b8b8" }}>
                                    <p>No awards given yet</p>
                                </div>
                            ) : (
                                <>
                                    <div className="awards-grid">
                                        {employeeAwards.map((award) => (
                                            <div key={award.id} className="award-card">
                                                <div className="award-badge">
                                                    <span className="award-icon">{award.award.split(" ")[0]}</span>
                                                    <span className="award-points">+{award.points} points</span>
                                                </div>
                                                <h3>{award.award.split(" ").slice(1).join(" ")}</h3>
                                                <p className="award-employee">🎖️ {award.employee}</p>
                                                <p className="award-description">{award.description}</p>
                                                <p className="award-date">📅 {award.date}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="leaderboard">
                                        <h3>🏆 Points Leaderboard</h3>
                                        <div className="leaderboard-list">
                                            {(() => {
                                                // Calculate total points per worker
                                                const workerPoints = new Map<string, { name: string; points: number }>();

                                                parsedEvents.awardEvents.forEach((award) => {
                                                    const worker = workerCards.find((w) => w.worker_address === award.worker_address);
                                                    const name = worker?.name || award.worker_address.slice(0, 8) + "...";

                                                    if (!workerPoints.has(award.worker_address)) {
                                                        workerPoints.set(award.worker_address, { name, points: 0 });
                                                    }
                                                    workerPoints.get(award.worker_address)!.points += award.points;
                                                });

                                                // Sort by points descending
                                                const sorted = Array.from(workerPoints.values())
                                                    .sort((a, b) => b.points - a.points)
                                                    .slice(0, 5);

                                                if (sorted.length === 0) {
                                                    return <p style={{ textAlign: "center", color: "#b8b8b8", padding: "20px" }}>No leaderboard data yet</p>;
                                                }

                                                return sorted.map((worker, index) => (
                                                    <div
                                                        key={index}
                                                        className={`leaderboard-item ${
                                                            index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""
                                                        }`}
                                                    >
                                                        <span className="rank">{index + 1}</span>
                                                        <span className="name">{worker.name}</span>
                                                        <span className="score">{worker.points} points</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {selectedView === "activity" && (
                        <div className="activity-feed-section">
                            <div className="section-header">
                                <h2>🔴 Live Activity Feed</h2>
                                <p>Real-time global system activity</p>
                            </div>

                            <div className="feed-container">
                                {/* Door Access Feed */}
                                {recentDoorAccess.length > 0 && (
                                    <div className="feed-card">
                                        <h3>🚪 Recent Door Access</h3>
                                        <div className="feed-list">
                                            {recentDoorAccess.slice(0, 15).map((event, i: number) => {
                                                const doorName =
                                                    typeof event.door_name === "string"
                                                        ? event.door_name
                                                        : new TextDecoder().decode(new Uint8Array(event.door_name as number[]));
                                                const isEntry = Number(event.access_type) === 2;

                                                return (
                                                    <div key={i} className="feed-item">
                                                        <span className="feed-icon">{isEntry ? "➡️" : "⬅️"}</span>
                                                        <div className="feed-info">
                                                            <span className="feed-title">{doorName}</span>
                                                            <span className="feed-time">{new Date(Number(event.timestamp_ms)).toLocaleString("tr-TR")}</span>
                                                        </div>
                                                        <span className="feed-badge">{isEntry ? "ENTRY" : "EXIT"}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Machine Usage Feed */}
                                {recentMachineUsage.length > 0 && (
                                    <div className="feed-card">
                                        <h3>⚙️ Recent Machine Usage</h3>
                                        <div className="feed-list">
                                            {recentMachineUsage.slice(0, 15).map((event, i: number) => {
                                                const machineName =
                                                    typeof event.machine_name === "string"
                                                        ? event.machine_name
                                                        : Array.isArray(event.machine_name)
                                                        ? new TextDecoder().decode(new Uint8Array(event.machine_name as number[]))
                                                        : "Unknown Machine";

                                                return (
                                                    <div key={i} className="feed-item">
                                                        <span className="feed-icon">⚙️</span>
                                                        <div className="feed-info">
                                                            <span className="feed-title">{machineName}</span>
                                                            <span className="feed-subtitle">
                                                                Production: {String(event.production_count || 0)} | Efficiency:{" "}
                                                                {String(event.efficiency_percentage || 0)}%
                                                            </span>
                                                            <span className="feed-time">{new Date(Number(event.timestamp_ms)).toLocaleString("tr-TR")}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Shift Feed */}
                                {recentShifts.length > 0 && (
                                    <div className="feed-card">
                                        <h3>🕐 Active Shifts</h3>
                                        <div className="feed-list">
                                            {recentShifts.slice(0, 15).map((event, i: number) => {
                                                const isClockIn = Number(event.action_type) === 0;

                                                return (
                                                    <div key={i} className="feed-item">
                                                        <span className="feed-icon">{isClockIn ? "🕐" : "🏁"}</span>
                                                        <div className="feed-info">
                                                            <span className="feed-title">{isClockIn ? "Shift Started" : "Shift Ended"}</span>
                                                            <span className="feed-time">
                                                                {event.timestamp_ms && Number(event.timestamp_ms) > 0
                                                                    ? new Date(Number(event.timestamp_ms)).toLocaleString("en-US")
                                                                    : "Invalid Date"}
                                                            </span>
                                                        </div>
                                                        <span className={`feed-badge ${isClockIn ? "start" : "end"}`}>{isClockIn ? "IN" : "OUT"}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Awards Feed */}
                                {recentAwards.length > 0 && (
                                    <div className="feed-card">
                                        <h3>🏆 Recent Awards</h3>
                                        <div className="feed-list">
                                            {recentAwards.slice(0, 15).map((event, i: number) => {
                                                const awardName =
                                                    typeof event.award_name === "string"
                                                        ? event.award_name
                                                        : new TextDecoder().decode(new Uint8Array(event.award_name as number[]));

                                                return (
                                                    <div key={i} className="feed-item">
                                                        <span className="feed-icon">🎁</span>
                                                        <div className="feed-info">
                                                            <span className="feed-title">{awardName}</span>
                                                            <span className="feed-subtitle">Points: {String(event.points || 0)}</span>
                                                            <span className="feed-time">{new Date(Number(event.timestamp_ms)).toLocaleString("tr-TR")}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {recentDoorAccess.length === 0 && recentMachineUsage.length === 0 && recentShifts.length === 0 && recentAwards.length === 0 && (
                                    <div style={{ textAlign: "center", padding: "40px", color: "#b8b8b8" }}>
                                        <p>No activity recorded yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
