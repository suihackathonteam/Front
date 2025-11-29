import LoadingSpinner from "../shared/LoadingSpinner";
import "../../styles/components/Shared.css";
import "../../styles/components/ResourceGrid.css";

interface Machine {
    machine_id: number;
    name: string;
    location: string;
    is_active: boolean;
    total_usage_time_ms?: number;
    total_production?: number;
}

interface MachineGridProps {
    machines: Machine[];
    loading?: boolean;
}

function MachineGrid({ machines, loading }: MachineGridProps) {
    if (loading) {
        return <LoadingSpinner size="medium" message="Loading machines..." />;
    }

    if (machines.length === 0) {
        return (
            <div className="resource-grid-empty">
                <p>No machines registered yet</p>
            </div>
        );
    }

    return (
        <div className="resource-grid">
            {machines.map((machine) => (
                <div key={machine.machine_id} className="resource-card machine-card">
                    <div className="resource-icon">⚙️</div>
                    <div className="resource-info">
                        <h4>{machine.name}</h4>
                        <p className="resource-location">📍 {machine.location}</p>
                        <div className="resource-stats">
                            {machine.total_usage_time_ms !== undefined && <span>⏱️ {(machine.total_usage_time_ms / (1000 * 3600)).toFixed(1)}h</span>}
                            {machine.total_production !== undefined && <span>📦 {machine.total_production} units</span>}
                        </div>
                        <div className="resource-meta">
                            <span className={`resource-status ${machine.is_active ? "active" : "inactive"}`}>{machine.is_active ? "Active" : "Inactive"}</span>
                            <span className="resource-id">ID: {machine.machine_id}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MachineGrid;
