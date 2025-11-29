import LoadingSpinner from "../shared/LoadingSpinner";
import "../../styles/components/Shared.css";
import "../../styles/components/EmployeeList.css";

interface WorkerCard {
    id: string;
    worker_address: string;
    card_number: string;
    name: string;
    department: string;
    is_active: boolean;
    total_work_hours: number;
    total_production: number;
    efficiency_score: number;
    event_count: number;
}

interface ClockEvent {
    worker_address: string;
    action_type: number;
    timestamp: Date;
}

interface EmployeeListProps {
    employees: WorkerCard[];
    clockEvents: ClockEvent[];
    onSelectEmployee: (name: string) => void;
    selectedEmployee: string | null;
    loading?: boolean;
}

function EmployeeList({ employees, clockEvents, onSelectEmployee, selectedEmployee, loading }: EmployeeListProps) {
    if (loading) {
        return <LoadingSpinner size="large" message="Loading employees..." />;
    }

    if (employees.length === 0) {
        return (
            <div className="employee-list-empty">
                <p>No employees found</p>
            </div>
        );
    }

    const getEmployeeStatus = (workerAddress: string): boolean => {
        const lastClock = clockEvents.filter((e) => e.worker_address === workerAddress).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
        return lastClock && lastClock.action_type === 0; // 0 = clock in
    };

    return (
        <div className="employee-list-container">
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Card Number</th>
                        <th>Work Hours</th>
                        <th>Production</th>
                        <th>Efficiency</th>
                        <th>Events</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((card, index) => {
                        const isActive = getEmployeeStatus(card.worker_address);
                        const isSelected = selectedEmployee === card.name;

                        return (
                            <tr key={index} onClick={() => onSelectEmployee(card.name)} className={isSelected ? "selected" : ""}>
                                <td>
                                    <span className="employee-name">👤 {card.name}</span>
                                </td>
                                <td>{card.department}</td>
                                <td>{card.card_number}</td>
                                <td>{(card.total_work_hours / (1000 * 3600)).toFixed(1)}h</td>
                                <td>{card.total_production} items</td>
                                <td>
                                    <span
                                        className={`efficiency-badge ${card.efficiency_score >= 80 ? "high" : card.efficiency_score >= 50 ? "medium" : "low"}`}
                                    >
                                        {card.efficiency_score}%
                                    </span>
                                </td>
                                <td>{card.event_count || 0}</td>
                                <td>
                                    <span className={`status ${isActive ? "active" : "offline"}`}>{isActive ? "Active" : "Offline"}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeList;
