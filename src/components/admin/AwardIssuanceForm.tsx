interface AwardIssuanceFormProps {
    values: { worker_address: string; award_type: string; points: string; description: string };
    loading: boolean;
    onChange: (v: { worker_address: string; award_type: string; points: string; description: string }) => void;
    onSubmit: (e: React.FormEvent) => Promise<void> | void;
}

function AwardIssuanceForm({ values, loading, onChange, onSubmit }: AwardIssuanceFormProps) {
    return (
        <div className="admin-form-card card">
            <h2>Give Award to Employee</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Worker Wallet Address</label>
                    <input
                        type="text"
                        placeholder="0x..."
                        value={values.worker_address}
                        onChange={(e) => onChange({ ...values, worker_address: e.target.value })}
                        required
                    />
                    <small>Employee's wallet address</small>
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
