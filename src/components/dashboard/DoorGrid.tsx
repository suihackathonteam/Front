import LoadingSpinner from "../shared/LoadingSpinner";
import "../../styles/components/Shared.css";
import "../../styles/components/ResourceGrid.css";

interface Door {
    door_id: number;
    name: string;
    location: string;
    is_active: boolean;
}

interface DoorGridProps {
    doors: Door[];
    loading?: boolean;
}

function DoorGrid({ doors, loading }: DoorGridProps) {
    if (loading) {
        return <LoadingSpinner size="medium" message="Loading doors..." />;
    }

    if (doors.length === 0) {
        return (
            <div className="resource-grid-empty">
                <p>No doors registered yet</p>
            </div>
        );
    }

    return (
        <div className="resource-grid">
            {doors.map((door) => (
                <div key={door.door_id} className="resource-card door-card">
                    <div className="resource-icon">🚪</div>
                    <div className="resource-info">
                        <h4>{door.name}</h4>
                        <p className="resource-location">📍 {door.location}</p>
                        <div className="resource-meta">
                            <span className={`resource-status ${door.is_active ? "active" : "inactive"}`}>{door.is_active ? "Active" : "Inactive"}</span>
                            <span className="resource-id">ID: {door.door_id}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DoorGrid;
