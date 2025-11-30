import { useState, useEffect, useMemo } from "react";
import useScrollAnimation from "../hooks/useScrollAnimation";
import "../styles/Home.css";
import { useCurrentAccount } from "@mysten/dapp-kit";
import SuiConnectButton from "../components/SuiConnectButton";
import { useIdentityEvents, useDoors, useMachines } from "../hooks/useIdentity";
import type { EventData } from "../types/sui";
import StatCard from "../components/dashboard/StatCard";
import DoorAccessChart from "../components/dashboard/DoorAccessChart";
import MachineUsageChart from "../components/dashboard/MachineUsageChart";
import EmployeeList from "../components/dashboard/EmployeeList";
import DoorGrid from "../components/dashboard/DoorGrid";
import MachineGrid from "../components/dashboard/MachineGrid";
import LoadingSpinner from "../components/shared/LoadingSpinner";

function isValidEvent(event: unknown): event is EventData {
    return typeof event === "object" && event !== null && "parsedJson" in event && typeof (event as EventData).parsedJson === "object";
}

function Dashboard() {
    useScrollAnimation();
    const [selectedView, setSelectedView] = useState("overview");
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const currentAccount = useCurrentAccount();

    const { events: allEvents, loading: eventsLoading } = useIdentityEvents("*");

    const { doors, loading: doorsLoading } = useDoors();
    const { machines, loading: machinesLoading } = useMachines();

    const [workerCards, setWorkerCards] = useState<any[]>([]);
    const [loadingCards, setLoadingCards] = useState(true);

    const parsedEvents = useMemo(() => {
        const doorEvents: any[] = [];
        const machineEvents: any[] = [];
        const clockEvents: any[] = [];
        const awardEvents: any[] = [];

        allEvents.forEach((event) => {
            if (!isValidEvent(event) || !event.type) return;
            const eventType = event.type.split("::").pop();
            const parsedJson = event.parsedJson;

            if (eventType === "DoorAccessEvent") doorEvents.push({ ...parsedJson, timestamp: new Date(Number(parsedJson?.timestamp_ms || 0)) });
            if (eventType === "MachineUsageEvent") machineEvents.push({ ...parsedJson, timestamp: new Date(Number(parsedJson?.timestamp_ms || 0)) });
            if (eventType === "ClockEvent") clockEvents.push({ ...parsedJson, timestamp: new Date(Number(parsedJson?.timestamp_ms || 0)) });
            if (eventType === "AwardEvent") awardEvents.push({ ...parsedJson, timestamp: new Date(Number(parsedJson?.timestamp_ms || 0)) });
        });
        return { doorEvents, machineEvents, clockEvents, awardEvents };
    }, [allEvents]);

    useEffect(() => {
        const fetchWorkerCards = async () => {
            if (!currentAccount) {
                setLoadingCards(false);
                return;
            }
            const uniqueWorkers = new Map();
            allEvents.forEach((event: any) => {
                if (!isValidEvent(event)) return;
                const address = String(event.parsedJson?.worker_address || "");
                if (!address || uniqueWorkers.has(address)) return;
                uniqueWorkers.set(address, {
                    id: address,
                    worker_address: address,
                    name: `Worker ${address.slice(0, 6)}`,
                    department: "General",
                });
            });
            setWorkerCards(Array.from(uniqueWorkers.values()));
            setLoadingCards(false);
        };
        fetchWorkerCards();
    }, [currentAccount, allEvents]);
    
    const doorAccessData = useMemo(() => {
        const hourlyData: { [key: string]: { entries: number; exits: number } } = {};
        parsedEvents.doorEvents.forEach((event) => {
            const hour = event.timestamp.getHours();
            const timeKey = `${String(hour).padStart(2, "0")}:00`;
            if (!hourlyData[timeKey]) hourlyData[timeKey] = { entries: 0, exits: 0 };
            if (Number(event.access_type) === 2) hourlyData[timeKey].entries++;
            else hourlyData[timeKey].exits++;
        });
        return Object.entries(hourlyData).map(([time, data]) => ({ time, ...data })).sort((a, b) => a.time.localeCompare(b.time));
    }, [parsedEvents.doorEvents]);

    const machineUsageData = useMemo(() => {
        const machineStats: { [key: string]: any } = {};
        parsedEvents.machineEvents.forEach((event) => {
            const machineId = String(event.machine_id);
            if (!machineStats[machineId]) machineStats[machineId] = { name: `Machine ${machineId}`, totalDuration: 0, totalProduction: 0, count: 0, totalEfficiency: 0 };
            machineStats[machineId].totalDuration += Number(event.usage_duration_ms || 0);
            machineStats[machineId].totalProduction += Number(event.production_count || 0);
            machineStats[machineId].totalEfficiency += Number(event.efficiency_percentage || 0);
            machineStats[machineId].count++;
        });
        return Object.values(machineStats).map(stats => ({
            machine: stats.name,
            usage: (stats.totalDuration / 3600000).toFixed(1),
            production: stats.totalProduction,
            efficiency: stats.count > 0 ? Math.round(stats.totalEfficiency / stats.count) : 0,
        }));
    }, [parsedEvents.machineEvents]);

    const realtimeStats = useMemo(() => {
        return [
            { title: "Active Workers", value: workerCards.length, icon: "👷" },
            { title: "Active Machines", value: machineUsageData.length, icon: "⚙️" },
            { title: "Total Production", value: machineUsageData.reduce((acc, m) => acc + m.production, 0), icon: "📦" },
            { title: "Today's Entries", value: parsedEvents.doorEvents.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString() && Number(e.access_type) === 2).length, icon: "🚪" },
        ];
    }, [workerCards, machineUsageData, parsedEvents]);

    if (!currentAccount) {
        return (
            <div className="text-center" style={{ paddingTop: '5rem' }}>
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Connect Your Wallet</h2>
                    <p style={{ color: 'var(--text-color-secondary)', marginBottom: '2rem' }}>
                        Connect your Sui wallet to access the dashboard.
                    </p>
                    <SuiConnectButton />
                </div>
            </div>
        );
    }

    if (eventsLoading || loadingCards) {
        return <LoadingSpinner size="large" message="Loading dashboard data..." />;
    }

    return (
        <div className="dashboard-page fade-in home-page">
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
            </div>

            <div className="dashboard-hero">
                <div className="hero-card-wrapper fade-in-up">
                    <div className="hero-card dashboard-hero-card">
                        <h1>Dashboard</h1>
                        <p>Real-time factory tracking & insights</p>
                        <div className="tabs hero-tabs">
                    <button className={`tab ${selectedView === "overview" ? "tab-active" : ""}`} onClick={() => setSelectedView("overview")}>Overview</button>
                    <button className={`tab ${selectedView === "doors" ? "tab-active" : ""}`} onClick={() => setSelectedView("doors")}>Doors</button>
                    <button className={`tab ${selectedView === "machines" ? "tab-active" : ""}`} onClick={() => setSelectedView("machines")}>Devices</button>
                    <button className={`tab ${selectedView === "employees" ? "tab-active" : ""}`} onClick={() => setSelectedView("employees")}>Employees</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-layout">
                <aside className="dashboard-sidebar">
                    <div className="stats-area" style={{ animation: 'fadeIn 0.6s ease-out' }}>
                        <div className="stats-grid">
                            {realtimeStats.map((stat, index) => (
                                <div className="stat-card card" key={index}>
                                    <StatCard title={stat.title} value={stat.value.toString()} icon={stat.icon} />
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="dashboard-main">
                    <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
                        {selectedView === "overview" && (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', 
                                gap: '2rem',
                                marginTop: '1rem'
                            }}>
                                <div className="chart-card card">
                                    <h2>Door Access (24h)</h2>
                                    <DoorAccessChart data={doorAccessData} loading={eventsLoading} />
                                </div>
                                <div className="chart-card card">
                                    <h2>Machine Usage (Hours)</h2>
                                    <MachineUsageChart data={machineUsageData} loading={eventsLoading} />
                                </div>
                            </div>
                        )}

                        {selectedView === "doors" && (
                            <div className="table-card card" style={{ marginTop: '1rem' }}>
                                <h2>Doors</h2>
                                <DoorGrid doors={doors} loading={doorsLoading} onEntryClick={() => {}} onExitClick={() => {}} />
                            </div>
                        )}
                        
                        {selectedView === "machines" && (
                            <div className="table-card card" style={{ marginTop: '1rem' }}>
                                <h2>Devices</h2>
                                <MachineGrid machines={machines} loading={machinesLoading} />
                            </div>
                        )}

                        {selectedView === "employees" && (
                            <div className="table-card card" style={{ marginTop: '1rem' }}>
                                <h2>Employees</h2>
                                <EmployeeList employees={workerCards} clockEvents={parsedEvents.clockEvents} onSelectEmployee={setSelectedEmployee} selectedEmployee={selectedEmployee} loading={loadingCards} />
                            </div>
                        )}
                    </div>
                </main>
            </div>

            
        </div>
    );
}

export default Dashboard;
