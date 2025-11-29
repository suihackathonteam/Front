import type { Door } from "../../types/identity";

interface DoorListProps {
    doors: Door[];
    loading: boolean;
}

function DoorList({ doors, loading }: DoorListProps) {
    return (
        <div className="admin-form-card">
            <h2>Registered Doors ({doors.length})</h2>
            {loading ? (
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
                                <span className={`status-badge ${door.is_active ? "active" : "inactive"}`}>{door.is_active ? "Active" : "Inactive"}</span>
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
    );
}

export default DoorList;
