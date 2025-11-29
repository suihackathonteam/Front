interface AdminTransferFormProps {
    values: { new_admin_address: string };
    loading: boolean;
    onChange: (v: { new_admin_address: string }) => void;
    onSubmit: (e: React.FormEvent) => Promise<void> | void;
}

function AdminTransferForm({ values, loading, onChange, onSubmit }: AdminTransferFormProps) {
    return (
        <div className="admin-form-card">
            <h2>Create New Admin</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>New Admin Address</label>
                    <input
                        type="text"
                        placeholder="0x..."
                        value={values.new_admin_address}
                        onChange={(e) => onChange({ new_admin_address: e.target.value })}
                        required
                    />
                    <small>✓ A new AdminCap will be created for this address. Your admin permissions will remain intact.</small>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Processing..." : "Create New Admin"}
                </button>
            </form>
        </div>
    );
}

export default AdminTransferForm;
