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
    buildAddNewAdminTx,
} from "../utils/transactions";
import { isContractConfigured } from "../config/contracts";
import SuiConnectButton from "../components/SuiConnectButton";
import "../styles/AdminPanel.css";

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

    const [transferAdminForm, setTransferAdminForm] = useState({
        new_admin_address: "",
    });

    const [doorForm, setDoorForm] = useState({
        name: "",
        location: "",
    });

    const [machineForm, setMachineForm] = useState({
        name: "",
        machine_type: "",
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
        console.log("🚀 Worker Card Form Submitted");
        console.log("Admin Cap ID:", adminCapId);
        console.log("Form Data:", workerForm);

        if (!adminCapId) {
            alert("⚠️ Admin capability not found");
            return;
        }

        // Validate address format
        if (!workerForm.worker_address.startsWith("0x") || workerForm.worker_address.length < 10) {
            alert("⚠️ Invalid Sui address format");
            return;
        }

        try {
            console.log("📝 Building transaction...");
            const tx = buildIssueWorkerCardTx(adminCapId, workerForm);
            console.log("✅ Transaction built successfully:", tx);

            console.log("🚀 Executing transaction...");
            executeTransaction(tx, {
                onSuccess: () => {
                    console.log("✅ Transaction executed successfully!");
                    setShowSuccess(true);
                    setWorkerForm({ worker_address: "", card_number: "", name: "", department: "" });
                    setTimeout(() => setShowSuccess(false), 3000);
                },
                onError: (error) => {
                    console.error("❌ Worker card creation failed:", error);
                },
            });
        } catch (error) {
            console.error("Error building transaction:", error);
            alert("⚠️ Failed to create transaction");
        }
    };

    const handleRegisterDoor = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🚪 Door Form Submitted");
        console.log("Admin Cap ID:", adminCapId);
        console.log("Form Data:", doorForm);

        if (!adminCapId) {
            alert("⚠️ Admin capability not found");
            return;
        }

        try {
            console.log("📝 Building transaction...");
            const tx = buildRegisterDoorTx(adminCapId, doorForm);
            console.log("✅ Transaction built successfully:", tx);

            console.log("🚀 Executing transaction...");
            executeTransaction(tx, {
                onSuccess: () => {
                    console.log("✅ Door registered successfully!");
                    setShowSuccess(true);
                    setDoorForm({ name: "", location: "" });
                    setTimeout(() => setShowSuccess(false), 3000);
                },
                onError: (error) => {
                    console.error("❌ Door registration failed:", error);
                },
            });
        } catch (error) {
            console.error("Error building transaction:", error);
            alert("⚠️ Failed to create transaction");
        }
    };

    const handleRegisterMachine = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("⚙️ Machine Form Submitted");
        console.log("Admin Cap ID:", adminCapId);
        console.log("Form Data:", machineForm);

        if (!adminCapId) {
            alert("⚠️ Admin capability not found");
            return;
        }

        try {
            console.log("📝 Building transaction...");
            const tx = buildRegisterMachineTx(adminCapId, machineForm);
            console.log("✅ Transaction built successfully:", tx);

            console.log("🚀 Executing transaction...");
            executeTransaction(tx, {
                onSuccess: () => {
                    console.log("✅ Machine registered successfully!");
                    setShowSuccess(true);
                    setMachineForm({ name: "", machine_type: "" });
                    setTimeout(() => setShowSuccess(false), 3000);
                },
                onError: (error) => {
                    console.error("❌ Machine registration failed:", error);
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
                setShowSuccess(true);
                setAwardForm({ worker_card_id: "", award_type: "", points: "", description: "" });
                setTimeout(() => setShowSuccess(false), 3000);
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
                setShowSuccess(true);
                setUpdateWorkerForm({ worker_card_id: "", name: "", department: "" });
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const handleCardStatusChange = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleDeactivateCard = async () => {
        if (!adminCapId || !cardManagementForm.worker_card_id) return;

        const tx = buildDeactivateWorkerCardTx(adminCapId, cardManagementForm.worker_card_id);

        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const handleActivateCard = async () => {
        if (!adminCapId || !cardManagementForm.worker_card_id) return;

        const tx = buildActivateWorkerCardTx(adminCapId, cardManagementForm.worker_card_id);

        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const handleTransferAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminCapId) return;

        const confirmation = window.confirm("⚠️ WARNING: A new AdminCap will be created for this address. Do you want to continue?");

        if (!confirmation) return;

        const tx = buildAddNewAdminTx(adminCapId, transferAdminForm.new_admin_address);

        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                setTransferAdminForm({ new_admin_address: "" });
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

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
                    <div className="admin-form-card">
                        <h2>Create New Worker Card</h2>
                        <form onSubmit={handleIssueWorkerCard}>
                            <div className="form-group">
                                <label>Worker Address (Sui Address)</label>
                                <input
                                    type="text"
                                    placeholder="0x..."
                                    value={workerForm.worker_address}
                                    onChange={(e) => setWorkerForm({ ...workerForm, worker_address: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Card Number</label>
                                <input
                                    type="text"
                                    placeholder="CARD-1001"
                                    value={workerForm.card_number}
                                    onChange={(e) => setWorkerForm({ ...workerForm, card_number: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={workerForm.name}
                                    onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    placeholder="Production"
                                    value={workerForm.department}
                                    onChange={(e) => setWorkerForm({ ...workerForm, department: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={txLoading}>
                                {txLoading ? "Processing..." : "Create Card"}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === "doors" && (
                    <>
                        <div className="admin-form-card">
                            <h2>Add New Door</h2>
                            <form onSubmit={handleRegisterDoor}>
                                <div className="form-group">
                                    <label>Door Name</label>
                                    <input
                                        type="text"
                                        placeholder="Main Entrance Door"
                                        value={doorForm.name}
                                        onChange={(e) => setDoorForm({ ...doorForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        placeholder="Ground Floor - Entrance"
                                        value={doorForm.location}
                                        onChange={(e) => setDoorForm({ ...doorForm, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="submit-btn" disabled={txLoading}>
                                    {txLoading ? "Processing..." : "Add Door"}
                                </button>
                            </form>
                        </div>

                        <div className="admin-form-card">
                            <h2>Registered Doors ({doors.length})</h2>
                            {doorsLoading ? (
                                <p className="loading-text">Loading doors...</p>
                            ) : doors.length === 0 ? (
                                <p className="no-data">No doors registered yet</p>
                            ) : (
                                <div className="list-container">
                                    {doors.map((door) => (
                                        <div key={door.door_id} className={`list-item ${!door.is_active ? "inactive" : ""}`}>
                                            <div className="list-item-header">
                                                <span className="door-icon">🚪</span>
                                                <div className="list-item-info">
                                                    <h3>{door.name}</h3>
                                                    <p className="location">📍 {door.location}</p>
                                                </div>
                                                <span className={`status-badge ${door.is_active ? "active" : "inactive"}`}>
                                                    {door.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                            <div className="list-item-details">
                                                <span className="detail-label">Door ID:</span>
                                                <span className="detail-value">{door.door_id}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "machines" && (
                    <>
                        <div className="admin-form-card">
                            <h2>Add New Machine/Resource</h2>
                            <form onSubmit={handleRegisterMachine}>
                                <div className="form-group">
                                    <label>Machine Name</label>
                                    <input
                                        type="text"
                                        placeholder="CNC-001"
                                        value={machineForm.name}
                                        onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Machine Type</label>
                                    <input
                                        type="text"
                                        placeholder="CNC Lathe"
                                        value={machineForm.machine_type}
                                        onChange={(e) => setMachineForm({ ...machineForm, machine_type: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="submit-btn" disabled={txLoading}>
                                    {txLoading ? "Processing..." : "Add Machine"}
                                </button>
                            </form>
                        </div>

                        <div className="admin-form-card">
                            <h2>Registered Machines ({machines.length})</h2>
                            {machinesLoading ? (
                                <p className="loading-text">Loading machines...</p>
                            ) : machines.length === 0 ? (
                                <p className="no-data">No machines registered yet</p>
                            ) : (
                                <div className="list-container">
                                    {machines.map((machine) => (
                                        <div key={machine.machine_id} className={`list-item ${!machine.is_active ? "inactive" : ""}`}>
                                            <div className="list-item-header">
                                                <span className="door-icon">⚙️</span>
                                                <div className="list-item-info">
                                                    <h3>{machine.name}</h3>
                                                    <p className="location">🔧 {machine.machine_type}</p>
                                                </div>
                                                <span className={`status-badge ${machine.is_active ? "active" : "inactive"}`}>
                                                    {machine.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                            <div className="list-item-details">
                                                <span className="detail-label">Machine ID:</span>
                                                <span className="detail-value">{machine.machine_id}</span>
                                                <span className="detail-label">Total Production:</span>
                                                <span className="detail-value">{machine.total_production || 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "awards" && (
                    <div className="admin-form-card">
                        <h2>Give Award to Employee</h2>
                        <form onSubmit={handleIssueAward}>
                            <div className="form-group">
                                <label>Worker Card ID</label>
                                <input
                                    type="text"
                                    placeholder="0x..."
                                    value={awardForm.worker_card_id}
                                    onChange={(e) => setAwardForm({ ...awardForm, worker_card_id: e.target.value })}
                                    required
                                />
                                <small>Employee's WorkerCard object ID</small>
                            </div>
                            <div className="form-group">
                                <label>Award Type</label>
                                <input
                                    type="text"
                                    placeholder="Employee of the Month"
                                    value={awardForm.award_type}
                                    onChange={(e) => setAwardForm({ ...awardForm, award_type: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Points</label>
                                <input
                                    type="number"
                                    placeholder="100"
                                    value={awardForm.points}
                                    onChange={(e) => setAwardForm({ ...awardForm, points: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Highest productivity performance"
                                    value={awardForm.description}
                                    onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
                                    required
                                    rows={3}
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={txLoading}>
                                {txLoading ? "Processing..." : "Give Award"}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === "manage" && (
                    <div className="manage-section">
                        <div className="admin-form-card">
                            <h2>Update Worker Card</h2>
                            <form onSubmit={handleUpdateWorkerCard}>
                                <div className="form-group">
                                    <label>Worker Card ID</label>
                                    <input
                                        type="text"
                                        placeholder="0x..."
                                        value={updateWorkerForm.worker_card_id}
                                        onChange={(e) => setUpdateWorkerForm({ ...updateWorkerForm, worker_card_id: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={updateWorkerForm.name}
                                        onChange={(e) => setUpdateWorkerForm({ ...updateWorkerForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Department</label>
                                    <input
                                        type="text"
                                        placeholder="Production"
                                        value={updateWorkerForm.department}
                                        onChange={(e) => setUpdateWorkerForm({ ...updateWorkerForm, department: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="submit-btn" disabled={txLoading}>
                                    {txLoading ? "Processing..." : "Update"}
                                </button>
                            </form>
                        </div>

                        <div className="admin-form-card">
                            <h2>Worker Card Status</h2>
                            <form onSubmit={handleCardStatusChange}>
                                <div className="form-group">
                                    <label>Worker Card ID</label>
                                    <input
                                        type="text"
                                        placeholder="0x..."
                                        value={cardManagementForm.worker_card_id}
                                        onChange={(e) => setCardManagementForm({ ...cardManagementForm, worker_card_id: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="button-group">
                                    <button type="button" className="submit-btn deactivate-btn" onClick={() => handleDeactivateCard()} disabled={txLoading}>
                                        🚫 Deactivate
                                    </button>
                                    <button type="button" className="submit-btn activate-btn" onClick={() => handleActivateCard()} disabled={txLoading}>
                                        ✅ Activate
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="admin-form-card">
                            <h2>Create New Admin</h2>
                            <form onSubmit={handleTransferAdmin}>
                                <div className="form-group">
                                    <label>New Admin Address</label>
                                    <input
                                        type="text"
                                        placeholder="0x..."
                                        value={transferAdminForm.new_admin_address}
                                        onChange={(e) => setTransferAdminForm({ ...transferAdminForm, new_admin_address: e.target.value })}
                                        required
                                    />
                                    <small>✓ A new AdminCap will be created for this address. Your admin permissions will remain intact.</small>
                                </div>
                                <button type="submit" className="submit-btn" disabled={txLoading}>
                                    {txLoading ? "Processing..." : "Create New Admin"}
                                </button>
                            </form>
                        </div>
                    </div>
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
                                                    <span>{isEntry ? "➡️" : "⬅️"}</span>
                                                    <span>{doorName}</span>
                                                    <span className="time">
                                                        {new Date(Number((eventData as { timestamp_ms?: number }).timestamp_ms)).toLocaleTimeString("tr-TR")}
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
                                                        {new Date(Number((eventData as { timestamp_ms?: number }).timestamp_ms)).toLocaleTimeString("tr-TR")}
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
                                                        {new Date(Number((eventData as { timestamp_ms?: number }).timestamp_ms)).toLocaleTimeString("tr-TR")}
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
