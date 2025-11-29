import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import LoadingSpinner from "../shared/LoadingSpinner";
import "../../styles/components/Shared.css";
import "../../styles/components/Charts.css";

interface MachineUsageChartProps {
    data: Array<{
        machine: string;
        usage: string | number;
        production: number;
        efficiency: number;
    }>;
    loading?: boolean;
}

function MachineUsageChart({ data, loading }: MachineUsageChartProps) {
    if (loading) {
        return <LoadingSpinner size="medium" message="Loading machine usage data..." />;
    }

    if (data.length === 0) {
        return (
            <div className="chart-empty-state">
                <p>No machine usage data available</p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">Machine Usage & Production</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="machine" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                        }}
                    />
                    <Legend />
                    <Bar dataKey="production" fill="#8b5cf6" name="Production" />
                    <Bar dataKey="efficiency" fill="#06b6d4" name="Efficiency %" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MachineUsageChart;
