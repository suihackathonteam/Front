import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useAdminCap, useIdentityTransaction, useDoors, useMachines } from "../hooks/useIdentity";
import { 
    buildIssueWorkerCardTx, 
    buildRegisterDoorTx, 
    buildRegisterMachineTx, 
    buildIssueAwardTx,
    buildUpdateDoorTx,
    buildUpdateMachineTx,
    buildActivateDoorTx,
    buildDeactivateDoorTx,
    buildActivateMachineTx,
    buildDeactivateMachineTx
} from "../utils/transactions";
import SuiConnectButton from "../components/SuiConnectButton";
import WorkerCardForm from "../components/admin/WorkerCardForm";
import DoorRegistrationForm from "../components/admin/DoorRegistrationForm";
import MachineRegistrationForm from "../components/admin/MachineRegistrationForm";
import AwardIssuanceForm from "../components/admin/AwardIssuanceForm";
import DoorList from "../components/admin/DoorList";
import MachineList from "../components/admin/MachineList";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import EditModal from "../components/admin/EditModal";
import useScrollAnimation from "../hooks/useScrollAnimation";
import "../styles/AdminPanel.css";

function isValidSuiAddress(address: string): boolean {
    return address.startsWith("0x") && address.length >= 10;
}

function AdminPanel() {
    useScrollAnimation();
    const account = useCurrentAccount();
    const { isAdmin, adminCapId, loading: adminLoading } = useAdminCap();
    const { executeTransaction, isLoading: txLoading, error: txError } = useIdentityTransaction();

    const { doors, loading: doorsLoading, refetch: refetchDoors } = useDoors();
    const { machines, loading: machinesLoading, refetch: refetchMachines } = useMachines();

    const [activeTab, setActiveTab] = useState("workers");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [workerForm, setWorkerForm] = useState({ worker_address: "", card_number: "", name: "", department: "" });
    const [doorForm, setDoorForm] = useState({ name: "", location: "" });
    const [machineForm, setMachineForm] = useState({ name: "", machine_type: "", location: "" });
    const [awardForm, setAwardForm] = useState({ worker_card_id: "", award_type: "", points: "", description: "" });

    // Edit modal states
    const [editDoorModal, setEditDoorModal] = useState<{ open: boolean; doorId: number | null; name: string; location: string }>({
        open: false,
        doorId: null,
        name: "",
        location: "",
    });
    const [editMachineModal, setEditMachineModal] = useState<{ open: boolean; machineId: number | null; name: string; machine_type: string; location: string }>({
        open: false,
        machineId: null,
        name: "",
        machine_type: "",
        location: "",
    });

    // Track initial load
    useEffect(() => {
        if (!adminLoading) {
            setIsInitialLoad(false);
        }
    }, [adminLoading]);

    const handleTransaction = (tx: any, onSuccess?: () => void) => {
        executeTransaction(tx, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                if (onSuccess) onSuccess();
            },
        });
    };

    // Door handlers
    const handleEditDoor = (doorId: number, name: string, location: string) => {
        setEditDoorModal({ open: true, doorId, name, location });
    };

    const handleUpdateDoor = (values: { name: string; location?: string }) => {
        if (!adminCapId || editDoorModal.doorId === null) return;
        const tx = buildUpdateDoorTx(adminCapId, editDoorModal.doorId, {
            name: values.name,
            location: values.location || "",
        });
        handleTransaction(tx, () => {
            setEditDoorModal({ open: false, doorId: null, name: "", location: "" });
            setTimeout(() => refetchDoors(), 1000);
        });
    };

    const handleActivateDoor = (doorId: number) => {
        if (!adminCapId) return;
        const tx = buildActivateDoorTx(adminCapId, doorId);
        handleTransaction(tx, () => {
            setTimeout(() => refetchDoors(), 1000);
        });
    };

    const handleDeactivateDoor = (doorId: number) => {
        if (!adminCapId) return;
        const tx = buildDeactivateDoorTx(adminCapId, doorId);
        handleTransaction(tx, () => {
            setTimeout(() => refetchDoors(), 1000);
        });
    };

    // Machine handlers
    const handleEditMachine = (machineId: number, name: string, machine_type: string, location: string) => {
        setEditMachineModal({ open: true, machineId, name, machine_type, location });
    };

    const handleUpdateMachine = (values: { name: string; location?: string; category?: string }) => {
        if (!adminCapId || editMachineModal.machineId === null) return;
        const tx = buildUpdateMachineTx(adminCapId, editMachineModal.machineId, {
            name: values.name,
            machine_type: editMachineModal.machine_type,
            location: values.location || "",
        });
        handleTransaction(tx, () => {
            setEditMachineModal({ open: false, machineId: null, name: "", machine_type: "", location: "" });
            setTimeout(() => refetchMachines(), 1000);
        });
    };

    const handleActivateMachine = (machineId: number) => {
        if (!adminCapId) return;
        const tx = buildActivateMachineTx(adminCapId, machineId);
        handleTransaction(tx, () => {
            setTimeout(() => refetchMachines(), 1000);
        });
    };

    const handleDeactivateMachine = (machineId: number) => {
        if (!adminCapId) return;
        const tx = buildDeactivateMachineTx(adminCapId, machineId);
        handleTransaction(tx, () => {
            setTimeout(() => refetchMachines(), 1000);
        });
    };

    if (!account) {
        return (
            <div className="text-center" style={{ paddingTop: "5rem" }}>
                <div className="card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem 2rem" }}>
                    <h2 style={{ marginBottom: "1rem" }}>Admin Panel</h2>
                    <p style={{ color: "var(--text-color-secondary)", marginBottom: "2rem" }}>Please connect your wallet to access the admin panel.</p>
                    <SuiConnectButton />
                </div>
            </div>
        );
    }

    if (adminLoading && isInitialLoad) {
        return <LoadingSpinner message="Checking permissions..." />;
    }

    if (!isAdmin) {
        return (
            <div className="text-center" style={{ paddingTop: "5rem" }}>
                <div className="card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem 2rem" }}>
                    <h2 style={{ marginBottom: "1rem", color: "#ff3b30" }}>🔒 Unauthorized Access</h2>
                    <p style={{ color: "var(--text-color-secondary)" }}>You must have AdminCap permission to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel fade-in" style={{ position: "relative" }}>
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
                {/* Decorative sparkles */}
                <div className="sparkle" style={{ top: "12%", left: "22%", animationDuration: "8s", animationDelay: "0s" }}></div>
                <div className="sparkle" style={{ top: "38%", left: "8%", animationDuration: "10s", animationDelay: "1s" }}></div>
                <div className="sparkle" style={{ top: "20%", left: "70%", animationDuration: "9s", animationDelay: "0.1s" }}></div>
                <div className="sparkle" style={{ top: "64%", left: "45%", animationDuration: "11s", animationDelay: "0.3s" }}></div>
                <div className="sparkle" style={{ top: "30%", left: "40%", animationDuration: "7s", animationDelay: "0.5s" }}></div>
                <div className="sparkle" style={{ top: "85%", left: "12%", animationDuration: "9s", animationDelay: "0.7s" }}></div>
                <div className="sparkle" style={{ top: "8%", left: "82%", animationDuration: "12s", animationDelay: "0.2s" }}></div>
                <div className="sparkle" style={{ top: "55%", left: "82%", animationDuration: "7s", animationDelay: "1.5s" }}></div>
                <div className="sparkle" style={{ top: "72%", left: "58%", animationDuration: "9s", animationDelay: "2s" }}></div>
                <div className="sparkle" style={{ top: "40%", left: "28%", animationDuration: "10s", animationDelay: "1s" }}></div>
            </div>
            {/* Background loading indicator */}
            {adminLoading && !isInitialLoad && (
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
                <div className="admin-header">
                    <h1>🔐 Admin Panel</h1>
                    <div className="tabs">
                        <button className={`tab ${activeTab === "workers" ? "tab-active" : ""}`} onClick={() => setActiveTab("workers")}>
                            👷 Worker Cards
                        </button>
                        <button className={`tab ${activeTab === "doors" ? "tab-active" : ""}`} onClick={() => setActiveTab("doors")}>
                            🚪 Doors
                        </button>
                        <button className={`tab ${activeTab === "machines" ? "tab-active" : ""}`} onClick={() => setActiveTab("machines")}>
                            ⚙️ Devices
                        </button>
                        <button className={`tab ${activeTab === "awards" ? "tab-active" : ""}`} onClick={() => setActiveTab("awards")}>
                            🏆 Give Award
                        </button>
                    </div>
                </div>

                {showSuccess && <div className="success-banner">✓ Transaction successful!</div>}
                {txError && (
                    <div
                        style={{
                            backgroundColor: "#ff3b30",
                            color: "white",
                            padding: "1rem",
                            borderRadius: "8px",
                            marginBottom: "1.5rem",
                            textAlign: "center",
                            fontWeight: "600",
                        }}
                    >
                        ⚠️ Error: {txError}
                    </div>
                )}

                <div style={{ marginTop: "1rem", animation: "fadeIn 0.6s ease-out" }}>
                    {activeTab === "workers" && (
                        <div className="form-card card">
                            <h2>👷 Issue Worker Card</h2>
                            <WorkerCardForm
                                values={workerForm}
                                loading={txLoading}
                                onChange={setWorkerForm}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!adminCapId || !isValidSuiAddress(workerForm.worker_address)) {
                                        alert("Invalid Sui address");
                                        return;
                                    }
                                    const tx = buildIssueWorkerCardTx(adminCapId, workerForm);
                                    handleTransaction(tx, () => {
                                        setWorkerForm({ worker_address: "", card_number: "", name: "", department: "" });
                                    });
                                }}
                            />
                        </div>
                    )}

                    {activeTab === "doors" && (
                        <>
                            <div className="form-card card" style={{ marginBottom: "2rem" }}>
                                <h2>🚪 Register a New Door</h2>
                                <DoorRegistrationForm
                                    values={doorForm}
                                    loading={txLoading}
                                    onChange={setDoorForm}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (!adminCapId) return;
                                        const tx = buildRegisterDoorTx(adminCapId, doorForm);
                                        handleTransaction(tx, () => {
                                            setDoorForm({ name: "", location: "" });
                                            setTimeout(() => refetchDoors(), 1000);
                                        });
                                    }}
                                />
                            </div>
                            <div className="table-card card">
                                <h2>🚪 Existing Doors</h2>
                                <DoorList 
                                    doors={doors} 
                                    loading={doorsLoading} 
                                    onEdit={handleEditDoor} 
                                    onActivate={handleActivateDoor} 
                                    onDeactivate={handleDeactivateDoor} 
                                />
                            </div>
                        </>
                    )}

                    {activeTab === "machines" && (
                        <>
                            <div className="form-card card" style={{ marginBottom: "2rem" }}>
                                <h2>⚙️ Register a New Device</h2>
                                <MachineRegistrationForm
                                    values={machineForm}
                                    loading={txLoading}
                                    onChange={setMachineForm}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (!adminCapId) return;
                                        const tx = buildRegisterMachineTx(adminCapId, machineForm);
                                        handleTransaction(tx, () => {
                                            setMachineForm({ name: "", machine_type: "", location: "" });
                                            setTimeout(() => refetchMachines(), 1000);
                                        });
                                    }}
                                />
                            </div>
                            <div className="table-card card">
                                <h2>⚙️ Existing Devices</h2>
                                <MachineList 
                                    machines={machines} 
                                    loading={machinesLoading} 
                                    onEdit={handleEditMachine} 
                                    onActivate={handleActivateMachine} 
                                    onDeactivate={handleDeactivateMachine} 
                                />
                            </div>
                        </>
                    )}

                    {activeTab === "awards" && (
                        <div className="form-card card">
                            <h2>🏆 Issue an Award</h2>
                            <AwardIssuanceForm
                                values={awardForm}
                                loading={txLoading}
                                onChange={setAwardForm}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!adminCapId) return;
                                    const tx = buildIssueAwardTx(adminCapId, awardForm.worker_card_id, {
                                        award_type: awardForm.award_type,
                                        points: Number(awardForm.points),
                                        description: awardForm.description,
                                    });
                                    handleTransaction(tx, () => {
                                        setAwardForm({ worker_card_id: "", award_type: "", points: "", description: "" });
                                    });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modals */}
            <EditModal
                open={editDoorModal.open}
                title="Edit Door"
                initial={{ name: editDoorModal.name, location: editDoorModal.location }}
                onClose={() => setEditDoorModal({ open: false, doorId: null, name: "", location: "" })}
                onSubmit={handleUpdateDoor}
            />
            <EditModal
                open={editMachineModal.open}
                title="Edit Machine"
                initial={{ name: editMachineModal.name, location: editMachineModal.location, category: editMachineModal.machine_type }}
                onClose={() => setEditMachineModal({ open: false, machineId: null, name: "", machine_type: "", location: "" })}
                onSubmit={handleUpdateMachine}
            />
        </div>
    );
}

export default AdminPanel;
