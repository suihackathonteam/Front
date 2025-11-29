import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import LoadingSpinner from "../shared/LoadingSpinner";
import "../shared/LoadingSpinner.tsx";
import "../../styles/components/Shared.css";
import "../../styles/components/Charts.css";

interface DoorAccessChartProps {
    data: Array<{ time: string; entries: number; exits: number }>;
    loading?: boolean;
}

function DoorAccessChart({ data, loading }: DoorAccessChartProps) {
    if (loading) {
        return <LoadingSpinner size="medium" message="Loading door access data..." />;
    }

    if (data.length === 0) {
        return (
            <div className="chart-empty-state">
                <p>No door access data available</p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">Door Access Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                        }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="entries" stroke="#10b981" strokeWidth={2} name="Entries" />
                    <Line type="monotone" dataKey="exits" stroke="#ef4444" strokeWidth={2} name="Exits" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DoorAccessChart;
