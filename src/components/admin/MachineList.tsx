import type { Machine } from "../../types/identity";

interface MachineListProps {
    machines: Machine[];
    loading: boolean;
    onEdit?: (machine_id: number, name: string, machine_type: string, location: string) => void;
    onActivate?: (machine_id: number) => void;
    onDeactivate?: (machine_id: number) => void;
}

function MachineList({ machines, loading, onEdit, onActivate, onDeactivate }: MachineListProps) {
    return (
        <div className="admin-form-card card">
            <h2>Registered Machines ({machines.length})</h2>
            {loading ? (
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
                                    <p className="location">
                                        🔧 {machine.machine_type}
                                        {machine.location && machine.location.length > 0 && ` • 📍 ${machine.location}`}
                                    </p>
                                </div>
                                <span className={`status-badge ${machine.is_active ? "active" : "inactive"}`}>{machine.is_active ? "Active" : "Inactive"}</span>
                            </div>
                            <div className="list-item-details">
                                <span className="detail-label">Device ID:</span>
                                <span className="detail-value">{machine.machine_id}</span>
                                <span className="detail-label">Total Production:</span>
                                <span className="detail-value">{machine.total_production || 0}</span>
                            </div>
                            <div className="list-item-actions">
                                <button className="action-btn edit-btn" onClick={() => onEdit?.(machine.machine_id, machine.name, machine.machine_type, machine.location)}>
                                    ✏️ Edit
                                </button>
                                {!machine.is_active ? (
                                    <button className="action-btn activate-btn" onClick={() => onActivate?.(machine.machine_id)}>
                                        ✅ Activate
                                    </button>
                                ) : (
                                    <button className="action-btn deactivate-btn" onClick={() => onDeactivate?.(machine.machine_id)}>
                                        🚫 Deactivate
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MachineList;
