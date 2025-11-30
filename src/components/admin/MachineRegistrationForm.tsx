interface MachineRegistrationFormProps {
    values: { name: string; machine_type: string; location: string; category?: string };
    loading: boolean;
    onChange: (v: { name: string; machine_type: string; location: string; category?: string }) => void;
    onSubmit: (e: React.FormEvent) => Promise<void> | void;
}

function MachineRegistrationForm({ values, loading, onChange, onSubmit }: MachineRegistrationFormProps) {
    return (
        <div className="admin-form-card card">
            <h2>Add New Device</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Machine Name</label>
                    <input type="text" placeholder="CNC-001" value={values.name} onChange={(e) => onChange({ ...values, name: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Device Category</label>
                    <input
                        type="text"
                        placeholder="CNC Lathe"
                        value={values.machine_type}
                        onChange={(e) => onChange({ ...values, machine_type: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category (extra meta)</label>
                    <input
                        type="text"
                        placeholder="Category: Lathe, CNC, Printer"
                        value={values.category || ""}
                        onChange={(e) => onChange({ ...values, category: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        placeholder="Section A"
                        value={values.location}
                        onChange={(e) => onChange({ ...values, location: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Processing..." : "Add Device"}
                </button>
            </form>
        </div>
    );
}

export default MachineRegistrationForm;
