interface AwardIssuanceFormProps {
    values: { worker_card_id: string; award_type: string; points: string; description: string };
    loading: boolean;
    onChange: (v: { worker_card_id: string; award_type: string; points: string; description: string }) => void;
    onSubmit: (e: React.FormEvent) => Promise<void> | void;
}

function AwardIssuanceForm({ values, loading, onChange, onSubmit }: AwardIssuanceFormProps) {
    return (
        <div className="admin-form-card">
            <h2>Give Award to Employee</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Worker Card ID</label>
                    <input
                        type="text"
                        placeholder="0x..."
                        value={values.worker_card_id}
                        onChange={(e) => onChange({ ...values, worker_card_id: e.target.value })}
                        required
                    />
                    <small>Employee's WorkerCard object ID</small>
                </div>
                <div className="form-group">
                    <label>Award Type</label>
                    <input
                        type="text"
                        placeholder="Employee of the Month"
                        value={values.award_type}
                        onChange={(e) => onChange({ ...values, award_type: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Points</label>
                    <input type="number" placeholder="100" value={values.points} onChange={(e) => onChange({ ...values, points: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        placeholder="Highest productivity performance"
                        value={values.description}
                        onChange={(e) => onChange({ ...values, description: e.target.value })}
                        required
                        rows={3}
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Processing..." : "Give Award"}
                </button>
            </form>
        </div>
    );
}

export default AwardIssuanceForm;
