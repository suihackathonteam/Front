interface WorkerInfoCardProps {
    workerCard: {
        card_number: string;
        name: string;
        department: string;
        worker_address: string;
        total_work_hours: number;
        total_production: number;
        current_shift_production: number;
        efficiency_score: number;
    };
    shiftActive: boolean;
    currentWorkTime: number;
    formatWorkHours: (ms: number) => string;
}

function WorkerInfoCard({ workerCard, shiftActive, currentWorkTime, formatWorkHours }: WorkerInfoCardProps) {
    return (
        <div className="info-grid worker-info-card">
            <div className="info-card">
                <h3>👤 Personal Information</h3>
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
                        {shiftActive && <div className="stat-small live-indicator">🔴 Active Shift</div>}
                    </div>
                </div>
                <div className="stat-box">
                    <span className="stat-icon">📦</span>
                    <div className="stat-details">
                        <span className="stat-label">Total Production</span>
                        <span className="stat-value">{workerCard.total_production} units</span>
                    </div>
                </div>
                <div className="stat-box">
                    <span className="stat-icon">🎯</span>
                    <div className="stat-details">
                        <span className="stat-label">Current Shift Production</span>
                        <span className="stat-value">{workerCard.current_shift_production} units</span>
                        {shiftActive && <div className="stat-small live-indicator">🔴 Active Shift</div>}
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
