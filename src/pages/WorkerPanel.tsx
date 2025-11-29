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
    const [machineUsageEfficiency, setMachineUsageEfficiency] = useState<number>(90);
    const [machineUsageMinutes, setMachineUsageMinutes] = useState<number>(0);
    const [machineUsageSeconds, setMachineUsageSeconds] = useState<number>(0);

    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<"info" | "activity" | "awards">("info");
    // Shift derived from on-chain state
    const derivedShiftActive = Boolean(workerCard?.is_in_shift);
    const shiftStartMs = workerCard?.current_shift_start_ms || 0;
    const [currentWorkTime, setCurrentWorkTime] = useState(0);
    const [productionUnits, setProductionUnits] = useState(1);
    const [efficiencyPercentage, setEfficiencyPercentage] = useState(90);

    // Live work time counter
    useEffect(() => {
        let interval: number | null = null;
        if (derivedShiftActive && shiftStartMs > 0) {
            interval = window.setInterval(() => {
                const now = Date.now();
                // shiftStartMs is chain timestamp (ms); elapsed is now - shiftStartMs
                const elapsed = now - shiftStartMs;
                if (elapsed >= 0) setCurrentWorkTime(elapsed);
            }, 1000);
        } else {
            setCurrentWorkTime(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [derivedShiftActive, shiftStartMs]);

    // auto refetch worker card after each relevant event (simple poll)
    useEffect(() => {
        const interval = setInterval(() => {
            refetchWorkerCard();
        }, 6000);
        return () => clearInterval(interval);
    }, [refetchWorkerCard]);

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
        if (derivedShiftActive) {
            alert("⚠️ A shift is already active on-chain. End it first.");
            return;
        }
        const tx = buildClockInOutTx(workerCard.id, CONTRACT_CONFIG.SYSTEM_REGISTRY_ID, ACTION_TYPES.CLOCK_IN);
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                refetchWorkerCard();
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const handleClockOut = async () => {
        if (!derivedShiftActive) {
            alert("⚠️ No active on-chain shift found.");
            return;
        }
        const tx = buildClockInOutTx(workerCard.id, CONTRACT_CONFIG.SYSTEM_REGISTRY_ID, ACTION_TYPES.CLOCK_OUT);
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                refetchWorkerCard();
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const handleIncrementProduction = () => {
        if (!derivedShiftActive) {
            alert("⚠️ Start a shift before recording production.");
            return;
        }
        const tx = buildIncrementProductionTx(workerCard.id, CONTRACT_CONFIG.SYSTEM_REGISTRY_ID, productionUnits, efficiencyPercentage);
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
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const handleDoorExit = async () => {
        if (!workerCard) return;
        const tx = buildRecordDoorAccessTx(workerCard.id, selectedDoorId, 3); // 3 = exit
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
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
        const tx = buildRecordMachineUsageTx(workerCard.id, {
            machine_id: selectedMachineId,
            usage_duration_ms: durationMs,
            production_count: machineUsageProductionCount,
            efficiency_percentage: machineUsageEfficiency,
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
        <div className="worker-container">
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
                    efficiencyPercentage={efficiencyPercentage}
                    onChangeProductionUnits={setProductionUnits}
                    onChangeEfficiency={setEfficiencyPercentage}
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
                                    #{d.door_id} - {d.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleDoorEntry} disabled={txLoading}>
                            Entry
                        </button>
                        <button onClick={handleDoorExit} disabled={txLoading}>
                            Exit
                        </button>
                    </div>
                )}
            </div>

            {showSuccess && <div className="success-banner">✓ Transaction successfully recorded!</div>}

            <div className="machine-usage-panel">
                <h2>⚙️ Machine Usage</h2>
                {machines.length === 0 ? (
                    <p className="no-data">No machines registered</p>
                ) : (
                    <div className="machine-usage-controls">
                        <select value={selectedMachineId} onChange={(e) => setSelectedMachineId(Number(e.target.value))}>
                            {machines.map((m) => (
                                <option key={m.machine_id} value={m.machine_id}>
                                    #{m.machine_id} - {m.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            min={0}
                            placeholder="Min"
                            value={machineUsageMinutes}
                            onChange={(e) => setMachineUsageMinutes(Number(e.target.value))}
                        />
                        <input
                            type="number"
                            min={0}
                            max={59}
                            placeholder="Sec"
                            value={machineUsageSeconds}
                            onChange={(e) => setMachineUsageSeconds(Number(e.target.value))}
                        />
                        <input
                            type="number"
                            min={0}
                            placeholder="Production units"
                            value={machineUsageProductionCount}
                            onChange={(e) => setMachineUsageProductionCount(Number(e.target.value))}
                        />
                        <input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="Eff%"
                            value={machineUsageEfficiency}
                            onChange={(e) => setMachineUsageEfficiency(Number(e.target.value))}
                        />
                        <button
                            onClick={handleRecordMachineUsage}
                            disabled={txLoading || machineUsageMinutes * 60000 + machineUsageSeconds * 1000 <= 0}
                            title={machineUsageMinutes * 60000 + machineUsageSeconds * 1000 <= 0 ? "Duration required" : "Record usage"}
                        >
                            Kaydet
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

            <div className="worker-content">
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

                {activeTab === "awards" && <AwardHistory totalAwardPoints={totalAwardPoints} awardHistory={awardHistory as any} recentAwards={awardEvents} />}
            </div>
        </div>
    );
}

export default WorkerPanel;
