interface WorkerManagementFormProps {
    updateValues: { worker_card_id: string; name: string; department: string };
    statusValues: { worker_card_id: string };
    loading: boolean;
    onUpdateChange: (v: { worker_card_id: string; name: string; department: string }) => void;
    onStatusChange: (v: { worker_card_id: string }) => void;
    onUpdateSubmit: (e: React.FormEvent) => Promise<void> | void;
    onDeactivate: () => Promise<void> | void;
    onActivate: () => Promise<void> | void;
}

function WorkerManagementForm({
    updateValues,
    statusValues,
    loading,
    onUpdateChange,
    onStatusChange,
    onUpdateSubmit,
    onDeactivate,
    onActivate,
}: WorkerManagementFormProps) {
    return (
        <div className="manage-section">
            <div className="admin-form-card">
                <h2>Update Worker Card</h2>
                <form onSubmit={onUpdateSubmit}>
                    <div className="form-group">
                        <label>Worker Card ID</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            value={updateValues.worker_card_id}
                            onChange={(e) => onUpdateChange({ ...updateValues, worker_card_id: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={updateValues.name}
                            onChange={(e) => onUpdateChange({ ...updateValues, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Department</label>
                        <input
                            type="text"
                            placeholder="Production"
                            value={updateValues.department}
                            onChange={(e) => onUpdateChange({ ...updateValues, department: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Processing..." : "Update"}
                    </button>
                </form>
            </div>

            <div className="admin-form-card">
                <h2>Worker Card Status</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Worker Card ID</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            value={statusValues.worker_card_id}
                            onChange={(e) => onStatusChange({ worker_card_id: e.target.value })}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="button" className="submit-btn deactivate-btn" onClick={onDeactivate} disabled={loading}>
                            🚫 Deactivate
                        </button>
                        <button type="button" className="submit-btn activate-btn" onClick={onActivate} disabled={loading}>
                            ✅ Activate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WorkerManagementForm;
