import { useState, useEffect } from "react";
import "../../styles/Theme.css";

interface EditModalProps {
    open: boolean;
    title?: string;
    initial: { name: string; location?: string; category?: string };
    onClose: () => void;
    onSubmit: (values: { name: string; location?: string; category?: string }) => void;
}

function EditModal({ open, title = "Edit", initial, onClose, onSubmit }: EditModalProps) {
    const [name, setName] = useState(initial.name || "");
    const [location, setLocation] = useState(initial.location || "");
    const [category, setCategory] = useState(initial.category || "");

    useEffect(() => {
        if (open) {
            setName(initial.name || "");
            setLocation(initial.location || "");
            setCategory(initial.category || "");
        }
    }, [open, initial]);

    if (!open) return null;

    return (
        <div className="modal-overlay" role="dialog">
            <div className="modal card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3>{title}</h3>
                    <button onClick={onClose} className="small-muted" aria-label="Close">✕</button>
                </div>

                <div style={{ marginTop: 12 }}>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8 }} />
                </div>

                <div style={{ marginTop: 12 }}>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Location</label>
                    <input value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8 }} />
                </div>

                <div style={{ marginTop: 12 }}>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Category</label>
                    <input value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8 }} />
                </div>

                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
                    <button className="btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            onSubmit({ name, location, category });
                            onClose();
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditModal;
