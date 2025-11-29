import "../../styles/components/StatCard.css";

interface StatCardProps {
    icon: string;
    title: string;
    value: string | number;
    change?: string;
    color?: string;
}

function StatCard({ icon, title, value, change, color = "#646cff" }: StatCardProps) {
    return (
        <div className="stat-card" style={{ borderColor: color }}>
            <div className="stat-icon" style={{ background: `${color}20` }}>
                {icon}
            </div>
            <div className="stat-content">
                <h3 className="stat-title">{title}</h3>
                <p className="stat-value" style={{ color }}>
                    {value}
                </p>
                {change && <span className="stat-change">{change}</span>}
            </div>
        </div>
    );
}

export default StatCard;
