interface WorkerCardFormProps {
    values: { worker_address: string; card_number: string; name: string; department: string };
    loading: boolean;
    onChange: (v: { worker_address: string; card_number: string; name: string; department: string }) => void;
    onSubmit: (e: React.FormEvent) => Promise<void> | void;
}

function WorkerCardForm({ values, loading, onChange, onSubmit }: WorkerCardFormProps) {
    return (
        <div className="admin-form-card">
            <h2>Create New Worker Card</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Worker Address (Sui Address)</label>
                    <input
                        type="text"
                        placeholder="0x..."
                        value={values.worker_address}
                        onChange={(e) => onChange({ ...values, worker_address: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Card Number</label>
                    <input
                        type="text"
                        placeholder="CARD-1001"
                        value={values.card_number}
                        onChange={(e) => onChange({ ...values, card_number: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" value={values.name} onChange={(e) => onChange({ ...values, name: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Department</label>
                    <input
                        type="text"
                        placeholder="Production"
                        value={values.department}
                        onChange={(e) => onChange({ ...values, department: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Processing..." : "Create Card"}
                </button>
            </form>
        </div>
    );
}

export default WorkerCardForm;
