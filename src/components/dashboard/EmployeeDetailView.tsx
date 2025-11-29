import "../../styles/components/EmployeeDetail.css";

interface DoorEvent {
    door_id: number;
    door_name: unknown;
    timestamp: Date;
    is_entry: boolean;
    worker_address: string;
}

interface MachineEvent {
    machine_id: number;
    machine_name: unknown;
    duration: number;
    production_count: number;
    efficiency: number;
    timestamp: Date;
    worker_address: string;
}

interface ClockEvent {
    action_type: number;
    timestamp: Date;
    worker_address: string;
}

interface EmployeeDetailViewProps {
    employeeName: string;
    workerAddress: string;
    doorEvents: DoorEvent[];
    machineEvents: MachineEvent[];
    clockEvents: ClockEvent[];
    onClose: () => void;
}

function EmployeeDetailView({ employeeName, workerAddress, doorEvents, machineEvents, clockEvents, onClose }: EmployeeDetailViewProps) {
    const decodeName = (name: unknown, defaultName: string): string => {
        try {
            if (typeof name === "string") return name;
            if (Array.isArray(name)) {
                return new TextDecoder().decode(new Uint8Array(name));
            }
        } catch (e) {
            console.warn("Name decode error:", e);
        }
        return defaultName;
    };

    const filteredDoorEvents = doorEvents.filter((e) => e.worker_address === workerAddress);
    const filteredMachineEvents = machineEvents.filter((e) => e.worker_address === workerAddress);
    const filteredClockEvents = clockEvents.filter((e) => e.worker_address === workerAddress);

    return (
        <div className="employee-detail">
            <h3>📊 {employeeName} - Detailed Report</h3>
            <div className="detail-grid">
                <div className="detail-card">
                    <h4>Door Access</h4>
                    <ul>
                        {filteredDoorEvents.length === 0 ? (
                            <li>No door access records</li>
                        ) : (
                            filteredDoorEvents.slice(0, 10).map((event, i) => {
                                const doorName = decodeName(event.door_name, `Door ${event.door_id}`);
                                return (
                                    <li key={i}>
                                        {doorName}: {event.timestamp.toLocaleTimeString("tr-TR")} - {event.is_entry ? "Entry" : "Exit"}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
                <div className="detail-card">
                    <h4>Machine Usage</h4>
                    <ul>
                        {filteredMachineEvents.length === 0 ? (
                            <li>No machine usage records</li>
                        ) : (
                            filteredMachineEvents.slice(0, 10).map((event, i) => {
                                const machineName = decodeName(event.machine_name, `Machine ${event.machine_id}`);
                                return (
                                    <li key={i}>
                                        {machineName}: {(event.duration / (1000 * 3600)).toFixed(1)}h - {event.production_count} items ({event.efficiency}%)
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
                <div className="detail-card">
                    <h4>Clock Events</h4>
                    <ul>
                        {filteredClockEvents.length === 0 ? (
                            <li>No clock events</li>
                        ) : (
                            filteredClockEvents.slice(0, 10).map((event, i) => (
                                <li key={i}>
                                    {event.action_type === 0 ? "🕐 Clock In" : "🏁 Clock Out"}: {event.timestamp.toLocaleString("tr-TR")}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
            <button className="close-detail" onClick={onClose}>
                Close
            </button>
        </div>
    );
}

export default EmployeeDetailView;
