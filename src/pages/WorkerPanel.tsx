import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useWorkerCard, useIdentityTransaction, useIdentityEvents, useWorkerAwardHistory } from "../hooks/useIdentity";
import { buildClockInOutTx, buildIncrementProductionTx, buildRecordDoorAccessTx, buildRecordMachineUsageTx } from "../utils/transactions";
import { ACTION_TYPES, CONTRACT_CONFIG } from "../config/contracts";
import SuiConnectButton from "../components/SuiConnectButton";
import "../styles/WorkerPanel.css";
import WorkerInfoCard from "../components/worker/WorkerInfoCard";
import ShiftControls from "../components/worker/ShiftControls";
import ActivityTimeline from "../components/worker/ActivityTimeline";
import { useDoors, useMachines } from "../hooks/useIdentity";
import AwardHistory from "../components/worker/AwardHistory";

// Helper: Format milliseconds to readable work hours
function formatWorkHours(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}s ${minutes}d ${seconds}sn`;
}

// Legacy local door entry helper removed (now on-chain)

// Helper: Clear shift data from localStorage
// legacy helper removed; on-chain shift state now authoritative

function WorkerPanel() {
    const account = useCurrentAccount();
    const { workerCard, loading: cardLoading, refetch: refetchWorkerCard } = useWorkerCard();
    const { executeTransaction, isLoading: txLoading } = useIdentityTransaction();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const { events: doorEvents } = useIdentityEvents("DoorAccessEvent");
    const { events: machineEvents } = useIdentityEvents("MachineUsageEvent");
    const { events: clockEvents } = useIdentityEvents("ClockEvent");
    const { events: awardEvents } = useIdentityEvents("AwardEvent");
    const { events: productionEvents } = useIdentityEvents("ProductionIncrementEvent");
    const { events: statsEvents } = useIdentityEvents("StatsUpdateEvent");

    // Fetch award history from worker card
    const { awardHistory, totalAwardPoints } = useWorkerAwardHistory(workerCard?.id);

    const { doors } = useDoors();
    const { machines } = useMachines();
    const [selectedDoorId, setSelectedDoorId] = useState<number>(() => (doors.length > 0 ? doors[0].door_id : 0));
    const [selectedMachineId, setSelectedMachineId] = useState<number>(() => (machines.length > 0 ? machines[0].machine_id : 0));
    const [machineUsageProductionCount, setMachineUsageProductionCount] = useState<number>(0);
    const [machineUsageMinutes, setMachineUsageMinutes] = useState<number>(0);
    const [machineUsageSeconds, setMachineUsageSeconds] = useState<number>(0);

    // Hedef: saatte 10 ürün (dakikada ~0.167 ürün)
    const TARGET_PRODUCTS_PER_MINUTE = 10 / 60;

    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<"info" | "activity" | "awards">("info");
    // Shift derived from on-chain state
    const derivedShiftActive = Boolean(workerCard?.is_in_shift);
    const shiftStartMs = workerCard?.current_shift_start_ms || 0;
    const [currentWorkTime, setCurrentWorkTime] = useState(0);
    const [productionUnits, setProductionUnits] = useState(1);

    // Track initial load completion
    useEffect(() => {
        if (!cardLoading && workerCard) {
            setIsInitialLoad(false);
        }
    }, [cardLoading, workerCard]);

    // Live work time counter
    useEffect(() => {
        let interval: number | null = null;
        if (derivedShiftActive && shiftStartMs > 0) {
            const updateWorkTime = () => {
                const now = Date.now();
                const elapsed = now - shiftStartMs;
                if (elapsed >= 0) setCurrentWorkTime(elapsed);
            };

            // Set initial value immediately
            updateWorkTime();

            // Then update every second
            interval = window.setInterval(updateWorkTime, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [derivedShiftActive, shiftStartMs]);

    if (!account) {
        return (
            <div className="text-center" style={{ paddingTop: "5rem" }}>
                <div className="card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem 2rem" }}>
                    <h2 style={{ marginBottom: "1rem" }}>👤 Worker Panel</h2>
                    <p style={{ color: "var(--text-color-secondary)", marginBottom: "2rem" }}>Please connect your wallet to access the panel.</p>
                    <SuiConnectButton />
                </div>
            </div>
        );
    }

    // Sadece ilk yüklemede tam ekran loading göster
    if (cardLoading && isInitialLoad) {
        return (
            <div className="text-center" style={{ paddingTop: "5rem" }}>
                <div className="card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem 2rem" }}>
                    <div className="spinner" style={{ margin: "0 auto 1.5rem" }}></div>
                    <p style={{ color: "var(--text-color-secondary)" }}>Checking Worker Card...</p>
                </div>
            </div>
        );
    }

    if (!workerCard) {
        return (
            <div className="text-center" style={{ paddingTop: "5rem" }}>
                <div className="card" style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem" }}>
                    <h2 style={{ marginBottom: "1rem", color: "#ff9500" }}>⚠️ Worker Card Not Found</h2>
                    <p style={{ color: "var(--text-color-secondary)", marginBottom: "1rem" }}>No Worker Card has been created for this address yet.</p>
                    <div
                        style={{
                            backgroundColor: "var(--section-bg)",
                            padding: "1rem",
                            borderRadius: "8px",
                            marginBottom: "1rem",
                            wordBreak: "break-all",
                        }}
                    >
                        <small style={{ color: "var(--text-color-secondary)" }}>Connected address:</small>
                        <br />
                        <code style={{ fontSize: "0.9rem" }}>{account.address}</code>
                    </div>
                    <p style={{ color: "var(--text-color-secondary)" }}>Please request a Worker Card from the system administrator.</p>
                </div>
            </div>
        );
    }

    if (!workerCard.is_active) {
        return (
            <div className="text-center" style={{ paddingTop: "5rem" }}>
                <div className="card" style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem" }}>
                    <h2 style={{ marginBottom: "1rem", color: "#ff3b30" }}>🚫 Worker Card Disabled</h2>
                    <p style={{ color: "var(--text-color-secondary)", marginBottom: "1rem" }}>Your card has been disabled by the system administrator.</p>
                    <div
                        style={{
                            backgroundColor: "var(--section-bg)",
                            padding: "1rem",
                            borderRadius: "8px",
                            marginBottom: "1rem",
                            wordBreak: "break-all",
                        }}
                    >
                        <small style={{ color: "var(--text-color-secondary)" }}>Connected address:</small>
                        <br />
                        <code style={{ fontSize: "0.9rem" }}>{account.address}</code>
                    </div>
                    <p style={{ color: "var(--text-color-secondary)" }}>Please contact the system administrator for more information.</p>
                </div>
            </div>
        );
    }

    const handleClockIn = async () => {
        if (derivedShiftActive) {
            alert("⚠️ Zaten aktif bir mesai var. Önce mesaiyi bitirin.");
            return;
        }
        if (txLoading) return;

        const tx = buildClockInOutTx(workerCard.id, CONTRACT_CONFIG.SYSTEM_REGISTRY_ID, ACTION_TYPES.CLOCK_IN);
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                // Hızlı refresh için birden fazla deneme
                refetchWorkerCard();
                setTimeout(() => refetchWorkerCard(), 1000);
                setTimeout(() => refetchWorkerCard(), 2000);
                setTimeout(() => setShowSuccess(false), 3000);
            },
            onError: (err) => {
                console.error("Clock in error:", err);
                alert("⚠️ Mesai başlatma başarısız: " + err);
            },
        });
    };

    const handleClockOut = async () => {
        if (!derivedShiftActive) {
            alert("⚠️ Aktif bir mesai bulunamadı. Önce mesai başlatın.");
            return;
        }
        if (txLoading) return;

        const tx = buildClockInOutTx(workerCard.id, CONTRACT_CONFIG.SYSTEM_REGISTRY_ID, ACTION_TYPES.CLOCK_OUT);
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                // Mesai bitince üretim sayacını sıfırla
                setProductionUnits(1);
                // Hızlı refresh için birden fazla deneme
                refetchWorkerCard();
                setTimeout(() => refetchWorkerCard(), 1000);
                setTimeout(() => refetchWorkerCard(), 2000);
                setTimeout(() => setShowSuccess(false), 3000);
            },
            onError: (err) => {
                console.error("Clock out error:", err);
                alert("⚠️ Mesai bitirme başarısız: " + err);
            },
        });
    };

    const handleIncrementProduction = () => {
        if (!derivedShiftActive) {
            alert("⚠️ Start a shift before recording production.");
            return;
        }
        // Verimlilik hesaplama: Mevcut mesai süresine göre dakikada kaç ürün üretildiğine bakıyoruz
        const workTimeMinutes = currentWorkTime / 60000; // ms to minutes
        const actualProductionRate = workTimeMinutes > 0 ? productionUnits / workTimeMinutes : 0;
        const calculatedEfficiency = Math.min(100, Math.round((actualProductionRate / TARGET_PRODUCTS_PER_MINUTE) * 100));

        const tx = buildIncrementProductionTx(workerCard.id, CONTRACT_CONFIG.SYSTEM_REGISTRY_ID, productionUnits, calculatedEfficiency);
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                refetchWorkerCard();
                // simple UX reset
                setProductionUnits(1);
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const handleDoorEntry = async () => {
        if (!workerCard) return;
        const tx = buildRecordDoorAccessTx(workerCard.id, selectedDoorId, 2); // 2 = entry
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                refetchWorkerCard();
                setTimeout(() => setShowSuccess(false), 3000);
            },
            onError: (err) => {
                alert("⚠️ Failed to record entry: " + err);
            },
        });
    };

    const handleDoorExit = async () => {
        if (!workerCard) return;
        const tx = buildRecordDoorAccessTx(workerCard.id, selectedDoorId, 3); // 3 = exit
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                refetchWorkerCard();
                setTimeout(() => setShowSuccess(false), 3000);
            },
            onError: (err) => {
                alert("⚠️ Failed to record exit: " + err);
            },
        });
    };

    const handleRecordMachineUsage = () => {
        if (!workerCard) return;
        if (!derivedShiftActive) {
            alert("⚠️ Start an active shift before machine usage.");
            return;
        }
        const durationMs = machineUsageMinutes * 60000 + machineUsageSeconds * 1000;
        if (durationMs <= 0) {
            alert("⚠️ Duration must be > 0 ms");
            return;
        }

        // Verimlilik hesaplama: Süre içinde üretilen ürün sayısına göre
        const durationMinutes = durationMs / 60000;
        const actualProductionRate = durationMinutes > 0 ? machineUsageProductionCount / durationMinutes : 0;
        const calculatedEfficiency = Math.min(100, Math.round((actualProductionRate / TARGET_PRODUCTS_PER_MINUTE) * 100));

        const tx = buildRecordMachineUsageTx(workerCard.id, {
            machine_id: selectedMachineId,
            usage_duration_ms: durationMs,
            production_count: machineUsageProductionCount,
            efficiency_percentage: calculatedEfficiency,
        });
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                refetchWorkerCard();
                setMachineUsageProductionCount(0);
                setMachineUsageMinutes(0);
                setMachineUsageSeconds(0);
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    return (
        <div className="worker-container" style={{ position: "relative" }}>
            {/* Background loading indicator - sonraki yüklemelerde */}
            {cardLoading && !isInitialLoad && (
                <div
                    style={{
                        position: "fixed",
                        top: "1rem",
                        right: "1rem",
                        zIndex: 9999,
                        backgroundColor: "rgba(0, 123, 255, 0.9)",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                    }}
                >
                    <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></div>
                    Updating...
                </div>
            )}
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
                <div className="worker-header">
                    <div className="worker-title">
                        <h1>👤 Worker Panel</h1>
                        <p>
                            {workerCard.name} - {workerCard.department}
                        </p>
                    </div>
                    <ShiftControls
                        onClockIn={handleClockIn}
                        onClockOut={handleClockOut}
                        productionUnits={productionUnits}
                        onChangeProductionUnits={setProductionUnits}
                        onIncrementProduction={handleIncrementProduction}
                        txLoading={txLoading}
                        shiftActive={derivedShiftActive}
                    />
                </div>

                <div className="door-access-panel">
                    <h2>🚪 Door Access</h2>
                    {doors.length === 0 ? (
                        <p className="no-data">No doors registered</p>
                    ) : (
                        <div className="door-access-controls">
                            <select value={selectedDoorId} onChange={(e) => setSelectedDoorId(Number(e.target.value))}>
                                {doors.map((d) => (
                                    <option key={d.door_id} value={d.door_id}>
                                        #{d.door_id} - {d.name} - {d.location}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleDoorEntry} disabled={txLoading}>
                                🔓 Entry
                            </button>
                            <button onClick={handleDoorExit} disabled={txLoading}>
                                🔒 Exit
                            </button>
                        </div>
                    )}
                </div>

                {showSuccess && (
                    <div
                        className="success-banner"
                        style={{
                            animation: "fadeIn 0.3s ease-out",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <span style={{ fontSize: "1.2rem" }}>✓</span>
                        <span>İşlem başarıyla blockchain'e kaydedildi!</span>
                    </div>
                )}

                <div className="machine-usage-panel">
                    <h2>⚙️ Machine Usage</h2>
                    {machines.length === 0 ? (
                        <p className="no-data">No machines registered</p>
                    ) : (
                        <div className="machine-usage-controls">
                            <select value={selectedMachineId} onChange={(e) => setSelectedMachineId(Number(e.target.value))}>
                                {machines.map((m) => (
                                    <option key={m.machine_id} value={m.machine_id}>
                                        #{m.machine_id} - {m.name} ({m.machine_type})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min={0}
                                placeholder="Minutes"
                                value={machineUsageMinutes}
                                onChange={(e) => setMachineUsageMinutes(Number(e.target.value))}
                                style={{ width: "100px" }}
                            />
                            <input
                                type="number"
                                min={0}
                                max={59}
                                placeholder="Seconds"
                                value={machineUsageSeconds}
                                onChange={(e) => setMachineUsageSeconds(Number(e.target.value))}
                                style={{ width: "100px" }}
                            />
                            <input
                                type="number"
                                min={0}
                                placeholder="Units produced"
                                value={machineUsageProductionCount}
                                onChange={(e) => setMachineUsageProductionCount(Number(e.target.value))}
                                style={{ width: "140px" }}
                            />
                            <button
                                onClick={handleRecordMachineUsage}
                                disabled={txLoading || machineUsageMinutes * 60000 + machineUsageSeconds * 1000 <= 0}
                                title={machineUsageMinutes * 60000 + machineUsageSeconds * 1000 <= 0 ? "Duration required" : "Record usage"}
                            >
                                💾 Record Usage
                            </button>
                        </div>
                    )}
                </div>

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

                <div className="worker-content" style={{ marginTop: "2rem" }}>
                    {activeTab === "info" && (
                        <WorkerInfoCard
                            workerCard={workerCard}
                            shiftActive={derivedShiftActive}
                            currentWorkTime={currentWorkTime}
                            formatWorkHours={formatWorkHours}
                        />
                    )}

                    {activeTab === "activity" && (
                        <ActivityTimeline
                            doorEvents={doorEvents as any}
                            machineEvents={machineEvents as any}
                            clockEvents={clockEvents as any}
                            productionEvents={productionEvents as any}
                            statsEvents={statsEvents as any}
                        />
                    )}

                    {activeTab === "awards" && (
                        <AwardHistory totalAwardPoints={totalAwardPoints} awardHistory={awardHistory as any} recentAwards={awardEvents} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default WorkerPanel;
