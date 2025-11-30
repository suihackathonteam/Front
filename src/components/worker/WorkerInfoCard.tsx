interface WorkerInfoCardProps {
    workerCard: {
        card_number: string;
        name: string;
        department: string;
        worker_address: string;
        total_work_hours: number;
        total_production: number;
        efficiency_score: number;
    };
    shiftActive: boolean;
    currentWorkTime: number;
    formatWorkHours: (ms: number) => string;
}

function WorkerInfoCard({ workerCard, shiftActive, currentWorkTime, formatWorkHours }: WorkerInfoCardProps) {
    return (
        <div className="info-grid worker-info-card">
            {shiftActive && (
                <div
                    className="shift-status-banner active-shift"
                    style={{
                        gridColumn: "1 / -1",
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "1rem 1.5rem",
                        borderRadius: "12px",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                        animation: "pulse 2s infinite",
                    }}
                >
                    <span style={{ fontSize: "1.5rem" }}>🟢</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Mesai Aktif</div>
                        <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Süre: {formatWorkHours(currentWorkTime)}</div>
                    </div>
                    <div
                        style={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                        }}
                    >
                        Blockchain'de Kayıtlı
                    </div>
                </div>
            )}
            {!shiftActive && (
                <div
                    className="shift-status-banner inactive-shift"
                    style={{
                        gridColumn: "1 / -1",
                        backgroundColor: "var(--section-bg)",
                        border: "2px solid var(--border-color)",
                        color: "var(--muted)",
                        padding: "1rem 1.5rem",
                        borderRadius: "12px",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <span style={{ fontSize: "1.5rem" }}>⭕</span>
                    <div>
                        <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Mesai Başlatılmamış</div>
                        <div style={{ fontSize: "0.9rem" }}>Mesaiyi başlatmak için yukarıdaki "Mesai Başlat" butonuna tıklayın</div>
                    </div>
                </div>
            )}
            <div className="info-card">
                "<h3>👤 Personal Information</h3>
                <div className="info-row">
                    <span className="label">Card No:</span>
                    <span className="value">{workerCard.card_number}</span>
                </div>
                <div className="info-row">
                    <span className="label">Full Name:</span>
                    <span className="value">{workerCard.name}</span>
                </div>
                <div className="info-row">
                    <span className="label">Department:</span>
                    <span className="value">{workerCard.department}</span>
                </div>
                <div className="info-row">
                    <span className="label">Address:</span>
                    <span className="value address">
                        {workerCard.worker_address.slice(0, 8)}...{workerCard.worker_address.slice(-6)}
                    </span>
                </div>
            </div>

            <div className="info-card worker-stats-card">
                <h3>📊 Statistics</h3>
                <div className="stat-box">
                    <span className="stat-icon">🕐</span>
                    <div className="stat-details">
                        <span className="stat-label">Total Working Hours</span>
                        <span className="stat-value">{shiftActive ? formatWorkHours(currentWorkTime) : formatWorkHours(workerCard.total_work_hours)}</span>
                        {shiftActive && <div className="stat-small live-indicator">🔴 Live - Shift Active</div>}
                    </div>
                </div>
                <div className="stat-box">
                    <span className="stat-icon">📦</span>
                    <div className="stat-details">
                        <span className="stat-label">Total Production</span>
                        <span className="stat-value">{workerCard.total_production} items</span>
                    </div>
                </div>
                <div className="stat-box">
                    <span className="stat-icon">⚡</span>
                    <div className="stat-details">
                        <span className="stat-label">Efficiency Score</span>
                        <span className="stat-value">{workerCard.efficiency_score}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkerInfoCard;
