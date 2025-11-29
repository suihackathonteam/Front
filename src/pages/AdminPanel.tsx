import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
    useAdminCap,
    useIdentityTransaction,
    useRegistryInfo,
    useRecentDoorAccess,
    useRecentMachineUsage,
    useRecentShifts,
    useRecentAwards,
    useDoors,
    useMachines,
} from "../hooks/useIdentity";
import {
    buildIssueWorkerCardTx,
    buildRegisterDoorTx,
    buildRegisterMachineTx,
    buildIssueAwardTx,
    buildUpdateWorkerCardTx,
    buildDeactivateWorkerCardTx,
    buildActivateWorkerCardTx,
} from "../utils/transactions";
import { isContractConfigured } from "../config/contracts";
import SuiConnectButton from "../components/SuiConnectButton";
import WorkerCardForm from "../components/admin/WorkerCardForm";
import DoorRegistrationForm from "../components/admin/DoorRegistrationForm";
import MachineRegistrationForm from "../components/admin/MachineRegistrationForm";
import AwardIssuanceForm from "../components/admin/AwardIssuanceForm";
import WorkerManagementForm from "../components/admin/WorkerManagementForm";
import DoorList from "../components/admin/DoorList";
import MachineList from "../components/admin/MachineList";
import "../styles/AdminPanel.css";

// Helper: Validate Sui address format
function isValidSuiAddress(address: string): boolean {
    return address.startsWith("0x") && address.length >= 10;
}

// Helper: Show success notification
function showSuccessNotification(setter: (value: boolean) => void, duration = 3000) {
    setter(true);
    setTimeout(() => setter(false), duration);
}

// Helper: Reset form state
function resetForm<T extends Record<string, string>>(setter: (value: T) => void, initialState: T) {
    setter(initialState);
}

function AdminPanel() {
    const account = useCurrentAccount();
    const { isAdmin, adminCapId, loading: adminLoading } = useAdminCap();
    const { executeTransaction, isLoading: txLoading, error: txError } = useIdentityTransaction();

    // Fetch global data
    const { registryInfo } = useRegistryInfo();
    const { recentDoorAccess } = useRecentDoorAccess();
    const { recentMachineUsage } = useRecentMachineUsage();
    const { recentShifts } = useRecentShifts();
    const { recentAwards } = useRecentAwards();
    const { doors, loading: doorsLoading } = useDoors();
    const { machines, loading: machinesLoading } = useMachines();

    const [activeTab, setActiveTab] = useState<"workers" | "doors" | "machines" | "awards" | "manage" | "analytics">("workers");
    const [showSuccess, setShowSuccess] = useState(false);

    const [workerForm, setWorkerForm] = useState({
        worker_address: "",
        card_number: "",
        name: "",
        department: "",
    });

    const [updateWorkerForm, setUpdateWorkerForm] = useState({
        worker_card_id: "",
        name: "",
        department: "",
    });

    const [cardManagementForm, setCardManagementForm] = useState({
        worker_card_id: "",
    });

    const [doorForm, setDoorForm] = useState({
        name: "",
        location: "",
    });

    const [machineForm, setMachineForm] = useState({
        name: "",
        machine_type: "",
        location: "",
    });

    const [awardForm, setAwardForm] = useState({
        worker_card_id: "",
        award_type: "",
        points: "",
        description: "",
    });

    if (!account) {
        return (
            <div className="admin-container">
                <div className="admin-connect">
                    <h2>🔐 Admin Panel</h2>
                    <p>Please connect your wallet to access the admin panel</p>
                    <SuiConnectButton />
                </div>
            </div>
        );
    }

    if (!isContractConfigured()) {
        return (
            <div className="admin-container">
                <div className="admin-warning">
                    <h2>⚠️ Contract Configuration Required</h2>
                    <p>Smart contract has not been deployed or configured yet.</p>
                    <div className="config-steps">
                        <h3>Steps Required:</h3>
                        <ol>
                            <li>Deploy the smart contract to Sui network</li>
                            <li>
                                Open <code>src/config/contracts.ts</code> file
                            </li>
                            <li>Update PACKAGE_ID and SYSTEM_REGISTRY_ID values</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    if (adminLoading) {
        return (
            <div className="admin-container">
                <div className="admin-loading">
                    <div className="spinner"></div>
                    <p>Checking permissions...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="admin-container">
                <div className="admin-unauthorized">
                    <h2>🚫 Unauthorized Access</h2>
                    <p>You must have AdminCap permission to access this page.</p>
                    <p className="address-info">
                        Connected address: <code>{account.address}</code>
                    </p>
                </div>
            </div>
        );
    }

    const handleIssueWorkerCard = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!adminCapId) {
            alert("⚠️ Admin capability not found");
            return;
        }

        if (!isValidSuiAddress(workerForm.worker_address)) {
            alert("⚠️ Invalid Sui address format");
            return;
        }

        try {
            const tx = buildIssueWorkerCardTx(adminCapId, workerForm);

            executeTransaction(tx, {
                onSuccess: () => {
                    showSuccessNotification(setShowSuccess);
                    resetForm(setWorkerForm, { worker_address: "", card_number: "", name: "", department: "" });
                },
            });
        } catch (error) {
            console.error("Error building transaction:", error);
            alert("⚠️ Failed to create transaction");
        }
    };

    const handleRegisterDoor = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!adminCapId) {
            alert("⚠️ Admin capability not found");
            return;
        }

        try {
            const tx = buildRegisterDoorTx(adminCapId, doorForm);

            executeTransaction(tx, {
                onSuccess: () => {
                    showSuccessNotification(setShowSuccess);
                    resetForm(setDoorForm, { name: "", location: "" });
                },
            });
        } catch (error) {
            console.error("Error building transaction:", error);
            alert("⚠️ Failed to create transaction");
        }
    };

    const handleRegisterMachine = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!adminCapId) {
            alert("⚠️ Admin capability not found");
            return;
        }

        try {
            const tx = buildRegisterMachineTx(adminCapId, machineForm);

            executeTransaction(tx, {
                onSuccess: () => {
                    showSuccessNotification(setShowSuccess);
                    resetForm(setMachineForm, { name: "", machine_type: "", location: "" });
                },
            });
        } catch (error) {
            console.error("Error building transaction:", error);
            alert("⚠️ Failed to create transaction");
        }
    };

    const handleIssueAward = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminCapId) return;

        const tx = buildIssueAwardTx(adminCapId, awardForm.worker_card_id, {
            award_type: awardForm.award_type,
            points: Number(awardForm.points),
            description: awardForm.description,
        });

        executeTransaction(tx, {
            onSuccess: () => {
                showSuccessNotification(setShowSuccess);
                resetForm(setAwardForm, { worker_card_id: "", award_type: "", points: "", description: "" });
            },
        });
    };

    const handleUpdateWorkerCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminCapId) return;

        const tx = buildUpdateWorkerCardTx(adminCapId, updateWorkerForm.worker_card_id, {
            name: updateWorkerForm.name,
            department: updateWorkerForm.department,
        });

        executeTransaction(tx, {
            onSuccess: () => {
                showSuccessNotification(setShowSuccess);
                resetForm(setUpdateWorkerForm, { worker_card_id: "", name: "", department: "" });
            },
        });
    };

    const handleDeactivateCard = async () => {
        if (!adminCapId || !cardManagementForm.worker_card_id) return;

        const tx = buildDeactivateWorkerCardTx(adminCapId, cardManagementForm.worker_card_id);

        executeTransaction(tx, {
            onSuccess: () => showSuccessNotification(setShowSuccess),
        });
    };

    const handleActivateCard = async () => {
        if (!adminCapId || !cardManagementForm.worker_card_id) return;

        const tx = buildActivateWorkerCardTx(adminCapId, cardManagementForm.worker_card_id);

        executeTransaction(tx, {
            onSuccess: () => showSuccessNotification(setShowSuccess),
        });
    };

    // Integrated via AdminTransferForm component

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>🔐 Admin Panel</h1>
                <div className="admin-info">
                    <span className="admin-badge">✓ Admin</span>
                    <span className="admin-address">
                        {account.address.slice(0, 6)}...{account.address.slice(-4)}
                    </span>
                </div>
            </div>

            {showSuccess && <div className="success-banner">✓ Transaction completed successfully!</div>}

            {txError && <div className="error-banner">✗ Error: {txError}</div>}

            <div className="admin-tabs">
                <button className={activeTab === "workers" ? "tab-active" : ""} onClick={() => setActiveTab("workers")}>
                    👥 Worker Cards
                </button>
                <button className={activeTab === "doors" ? "tab-active" : ""} onClick={() => setActiveTab("doors")}>
                    🚪 Doors
                </button>
                <button className={activeTab === "machines" ? "tab-active" : ""} onClick={() => setActiveTab("machines")}>
                    ⚙️ Machines
                </button>
                <button className={activeTab === "awards" ? "tab-active" : ""} onClick={() => setActiveTab("awards")}>
                    🏆 Give Award
                </button>
                <button className={activeTab === "manage" ? "tab-active" : ""} onClick={() => setActiveTab("manage")}>
                    🔧 Management
                </button>
                <button className={activeTab === "analytics" ? "tab-active" : ""} onClick={() => setActiveTab("analytics")}>
                    📊 Analytics
                </button>
            </div>

            <div className="admin-content">
                {activeTab === "workers" && (
                    <WorkerCardForm values={workerForm} loading={txLoading} onChange={setWorkerForm} onSubmit={handleIssueWorkerCard} />
                )}

                {activeTab === "doors" && (
                    <>
                        <DoorRegistrationForm values={doorForm} loading={txLoading} onChange={setDoorForm} onSubmit={handleRegisterDoor} />

                        <DoorList doors={doors} loading={doorsLoading} />
                    </>
                )}

                {activeTab === "machines" && (
                    <>
                        <MachineRegistrationForm values={machineForm} loading={txLoading} onChange={setMachineForm} onSubmit={handleRegisterMachine} />

                        <MachineList machines={machines} loading={machinesLoading} />
                    </>
                )}

                {activeTab === "awards" && <AwardIssuanceForm values={awardForm} loading={txLoading} onChange={setAwardForm} onSubmit={handleIssueAward} />}

                {activeTab === "manage" && (
                    <WorkerManagementForm
                        updateValues={updateWorkerForm}
                        statusValues={cardManagementForm}
                        loading={txLoading}
                        onUpdateChange={setUpdateWorkerForm}
                        onStatusChange={setCardManagementForm}
                        onUpdateSubmit={handleUpdateWorkerCard}
                        onDeactivate={handleDeactivateCard}
                        onActivate={handleActivateCard}
                    />
                )}

                {activeTab === "analytics" && (
                    <div className="tab-content">
                        <div className="analytics-header">
                            <h2>📊 System Analytics</h2>
                            <p>Global system statistics and real-time monitoring</p>
                        </div>

                        <div className="analytics-grid">
                            <div className="analytics-card">
                                <div className="metric">
                                    <span className="metric-icon">🚪</span>
                                    <span className="metric-label">Total Doors</span>
                                    <span className="metric-value">{registryInfo.doorCounter}</span>
                                </div>
                            </div>
                            <div className="analytics-card">
                                <div className="metric">
                                    <span className="metric-icon">⚙️</span>
                                    <span className="metric-label">Total Machines</span>
                                    <span className="metric-value">{registryInfo.machineCounter}</span>
                                </div>
                            </div>
                            <div className="analytics-card">
                                <div className="metric">
                                    <span className="metric-icon">🚪</span>
                                    <span className="metric-label">Recent Door Access</span>
                                    <span className="metric-value">{recentDoorAccess.length}</span>
                                </div>
                            </div>
                            <div className="analytics-card">
                                <div className="metric">
                                    <span className="metric-icon">🕐</span>
                                    <span className="metric-label">Active Shifts</span>
                                    <span className="metric-value">{recentShifts.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="analytics-row">
                            <div className="analytics-section-card">
                                <h3>🚪 Recent Door Access</h3>
                                <div className="analytics-list">
                                    {recentDoorAccess.length === 0 ? (
                                        <p className="no-data">No door access recorded yet</p>
                                    ) : (
                                        recentDoorAccess.slice(0, 10).map((event: unknown, i: number) => {
                                            const eventData = event as { door_name: string | number[]; worker_address?: string; timestamp?: number };
                                            const doorName =
                                                typeof eventData.door_name === "string"
                                                    ? eventData.door_name
                                                    : new TextDecoder().decode(new Uint8Array(eventData.door_name));
                                            const isEntry = Number((eventData as { access_type?: number }).access_type) === 2;

                                            return (
                                                <div key={i} className="analytics-item">
                                                    <span>{isEntry ? "➞️" : "⬅️"}</span>
                                                    <span>{doorName}</span>
                                                    <span className="time">
                                                        {(eventData as { timestamp_ms?: number }).timestamp_ms &&
                                                        Number((eventData as { timestamp_ms?: number }).timestamp_ms) > 0
                                                            ? new Date(Number((eventData as { timestamp_ms?: number }).timestamp_ms)).toLocaleTimeString(
                                                                  "en-US"
                                                              )
                                                            : "Invalid Date"}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="analytics-section-card">
                                <h3>⚙️ Recent Machine Usage</h3>
                                <div className="analytics-list">
                                    {recentMachineUsage.length === 0 ? (
                                        <p className="no-data">No machine usage recorded yet</p>
                                    ) : (
                                        recentMachineUsage.slice(0, 10).map((event: unknown, i: number) => {
                                            const eventData = event as { machine_name: string | number[]; production_count?: number; efficiency?: number };
                                            const machineName =
                                                typeof eventData.machine_name === "string"
                                                    ? eventData.machine_name
                                                    : new TextDecoder().decode(new Uint8Array(eventData.machine_name));

                                            return (
                                                <div key={i} className="analytics-item">
                                                    <span>⚙️</span>
                                                    <span>{machineName}</span>
                                                    <span className="time">
                                                        {(eventData as { timestamp_ms?: number }).timestamp_ms &&
                                                        Number((eventData as { timestamp_ms?: number }).timestamp_ms) > 0
                                                            ? new Date(Number((eventData as { timestamp_ms?: number }).timestamp_ms)).toLocaleTimeString(
                                                                  "en-US"
                                                              )
                                                            : "Invalid Date"}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="analytics-row">
                            <div className="analytics-section-card">
                                <h3>🕐 Recent Shifts</h3>
                                <div className="analytics-list">
                                    {recentShifts.length === 0 ? (
                                        <p className="no-data">No shift activity recorded yet</p>
                                    ) : (
                                        recentShifts.slice(0, 10).map((event: unknown, i: number) => {
                                            const eventData = event as { worker_name: string | number[]; action_type?: number; timestamp?: number };
                                            const isClockIn = Number(eventData.action_type) === 0;

                                            return (
                                                <div key={i} className="analytics-item">
                                                    <span>{isClockIn ? "🕐" : "🏁"}</span>
                                                    <span>{isClockIn ? "Shift Start" : "Shift End"}</span>
                                                    <span className="time">
                                                        {(eventData as { timestamp_ms?: number }).timestamp_ms &&
                                                        Number((eventData as { timestamp_ms?: number }).timestamp_ms) > 0
                                                            ? new Date(Number((eventData as { timestamp_ms?: number }).timestamp_ms)).toLocaleTimeString(
                                                                  "en-US"
                                                              )
                                                            : "Invalid Date"}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="analytics-section-card">
                                <h3>🏆 Recent Awards</h3>
                                <div className="analytics-list">
                                    {recentAwards.length === 0 ? (
                                        <p className="no-data">No awards issued yet</p>
                                    ) : (
                                        recentAwards.slice(0, 10).map((event: unknown, i: number) => {
                                            const eventData = event as { award_type: string | number[]; points?: number; worker_name?: string | number[] };
                                            const awardType =
                                                typeof eventData.award_type === "string"
                                                    ? eventData.award_type
                                                    : new TextDecoder().decode(new Uint8Array(eventData.award_type));

                                            return (
                                                <div key={i} className="analytics-item">
                                                    <span>🎁</span>
                                                    <span>{awardType}</span>
                                                    <span className="points">+{eventData.points}</span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;
