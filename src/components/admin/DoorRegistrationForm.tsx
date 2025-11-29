interface DoorRegistrationFormProps {
    values: { name: string; location: string };
    loading: boolean;
    onChange: (v: { name: string; location: string }) => void;
    onSubmit: (e: React.FormEvent) => Promise<void> | void;
}

function DoorRegistrationForm({ values, loading, onChange, onSubmit }: DoorRegistrationFormProps) {
    return (
        <div className="admin-form-card">
            <h2>Add New Door</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Door Name</label>
                    <input
                        type="text"
                        placeholder="Main Entrance Door"
                        value={values.name}
                        onChange={(e) => onChange({ ...values, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        placeholder="Ground Floor - Entrance"
                        value={values.location}
                        onChange={(e) => onChange({ ...values, location: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Processing..." : "Add Door"}
                </button>
            </form>
        </div>
    );
}

export default DoorRegistrationForm;
