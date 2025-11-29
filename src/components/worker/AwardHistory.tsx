interface AwardItem {
    award_type: string | number[];
    description: string | number[];
    points: number;
    timestamp_ms: number | string;
}

interface AwardEventData {
    award_type?: string | number[];
    points?: number;
    timestamp_ms?: number | string;
}

interface AwardHistoryProps {
    totalAwardPoints: number;
    awardHistory: AwardItem[];
    recentAwards?: Array<{ parsedJson?: AwardEventData }>;
}

function AwardHistory({ totalAwardPoints, awardHistory, recentAwards = [] }: AwardHistoryProps) {
    const decode = (value: unknown, fallback = ""): string => {
        try {
            if (typeof value === "string") return value;
            if (Array.isArray(value)) return new TextDecoder().decode(new Uint8Array(value as number[]));
        } catch {
            return fallback;
        }
        return fallback;
    };

    return (
        <div className="tab-content award-history">
            <div className="award-summary">
                <div className="award-stats">
                    <div className="stat-card">
                        <span className="stat-label">Total Points</span>
                        <span className="stat-value">{totalAwardPoints}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Awards Received</span>
                        <span className="stat-value">{awardHistory.length}</span>
                    </div>
                </div>
            </div>

            <div className="activity-card">
                <h3>🏆 Award History</h3>
                <div className="activity-list">
                    {awardHistory.length === 0 ? (
                        <p className="no-data">No awards yet. Keep up the good work! 💪</p>
                    ) : (
                        awardHistory.map((award, i) => {
                            const awardType = decode(award.award_type, "");
                            const description = decode(award.description, "");

                            return (
                                <div key={i} className="award-item">
                                    <div className="award-icon">🏅</div>
                                    <div className="award-details">
                                        <span className="award-type">{awardType}</span>
                                        <span className="award-description">{description}</span>
                                        <span className="award-date">{new Date(Number(award.timestamp_ms)).toLocaleString("tr-TR")}</span>
                                    </div>
                                    <span className="award-points">+{award.points}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {recentAwards.length > 0 && (
                <div className="activity-card">
                    <h3>📢 Recent Award Events</h3>
                    <div className="activity-list">
                        {recentAwards.slice(0, 10).map((event, i) => {
                            const data = event.parsedJson || {};
                            const awardType = decode(data.award_type, "");

                            return (
                                <div key={i} className="activity-item">
                                    <span className="activity-icon">🎁</span>
                                    <div className="activity-details">
                                        <span className="activity-title">{awardType}</span>
                                        <span className="activity-subtitle">Points: {String(data?.points || 0)}</span>
                                        <span className="activity-time">{new Date(Number(data?.timestamp_ms || 0)).toLocaleString("tr-TR")}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AwardHistory;
