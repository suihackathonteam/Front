import type { Machine } from "../../types/identity";

interface MachineListProps {
    machines: Machine[];
    loading: boolean;
}

function MachineList({ machines, loading }: MachineListProps) {
    return (
        <div className="admin-form-card">
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
                                    <p className="location">🔧 {machine.machine_type}</p>
                                </div>
                                <span className={`status-badge ${machine.is_active ? "active" : "inactive"}`}>{machine.is_active ? "Active" : "Inactive"}</span>
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
    );
}

export default MachineList;
