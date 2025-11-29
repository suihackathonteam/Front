// Unified activity timeline component

interface ParsedEvent<T = unknown> {
    parsedJson?: T;
}

interface DoorEventData {
    door_name?: string | number[];
    door_id?: number;
    timestamp?: number | string;
    is_entry?: boolean;
}

interface MachineEventData {
    machine_name?: string | number[];
    production_count?: number;
    efficiency_percentage?: number;
    timestamp?: number | string;
}

interface ClockEventData {
    action_type?: number | string;
    timestamp?: number | string;
}

interface ProductionEventData {
    production_units?: number;
    efficiency_percentage?: number;
    timestamp_ms?: number | string;
}

interface StatsEventData {
    total_work_hours_ms?: number | string;
    total_production?: number | string;
    efficiency_score?: number | string;
    timestamp_ms?: number | string;
}

interface ActivityTimelineProps {
    doorEvents: Array<ParsedEvent<DoorEventData>>;
    machineEvents: Array<ParsedEvent<MachineEventData>>;
    clockEvents: Array<ParsedEvent<ClockEventData>>;
    productionEvents: Array<ParsedEvent<ProductionEventData>>;
    statsEvents: Array<ParsedEvent<StatsEventData>>;
}

function ActivityTimeline({ doorEvents, machineEvents, clockEvents, productionEvents, statsEvents }: ActivityTimelineProps) {
    // Normalize events into a unified array
    type UnifiedItem = {
        icon: string;
        title: string;
        subtitle?: string;
        badge?: string;
        badgeClass?: string;
        timestamp: number;
    };

    const decoder = new TextDecoder();

    const safeDecode = (v: unknown): string => {
        if (typeof v === "string") return v;
        if (Array.isArray(v)) {
            try {
                return decoder.decode(new Uint8Array(v as number[]));
            } catch {
                return "";
            }
        }
        return String(v || "");
    };

    const toNumber = (v: unknown): number => {
        if (v === undefined || v === null) return 0;
        const n = Number(v);
        return isNaN(n) ? 0 : n;
    };

    const unifyDoor = doorEvents.map((e) => {
        const d = (e.parsedJson || {}) as DoorEventData;
        const ts = toNumber((d as any).timestamp_ms ?? (d as any).timestamp);
        const name = safeDecode(d.door_name);
        const isEntry = Boolean(d.is_entry) || (d as any).access_type === 2;
        return {
            icon: isEntry ? "➡️" : "⬅️",
            title: name || `Door ${d.door_id || "?"}`,
            subtitle: isEntry ? "Entry" : "Exit",
            badge: isEntry ? "Entry" : "Exit",
            badgeClass: isEntry ? "entry" : "exit",
            timestamp: ts,
        } as UnifiedItem;
    });

    const unifyMachine = machineEvents.map((e) => {
        const d = (e.parsedJson || {}) as MachineEventData;
        const ts = toNumber((d as any).timestamp_ms ?? d.timestamp);
        const name = safeDecode(d.machine_name);
        return {
            icon: "⚙️",
            title: name || "Machine",
            subtitle: `Prod ${d.production_count || 0} | Eff ${d.efficiency_percentage || 0}%`,
            timestamp: ts,
        } as UnifiedItem;
    });

    const unifyClock = clockEvents.map((e) => {
        const d = (e.parsedJson || {}) as ClockEventData;
        const ts = toNumber((d as any).timestamp_ms ?? d.timestamp);
        const isIn = Number(d.action_type) === 0;
        return {
            icon: isIn ? "🕐" : "🏁",
            title: isIn ? "Shift Start" : "Shift End",
            timestamp: ts,
        } as UnifiedItem;
    });

    const unifyProduction = productionEvents.map((e) => {
        const d = (e.parsedJson || {}) as ProductionEventData;
        const ts = toNumber(d.timestamp_ms);
        return {
            icon: "📦",
            title: `+${d.production_units || 0} units`,
            subtitle: `Eff ${d.efficiency_percentage || 0}%`,
            timestamp: ts,
        } as UnifiedItem;
    });

    const unifyStats = statsEvents.map((e) => {
        const d = (e.parsedJson || {}) as StatsEventData;
        const ts = toNumber(d.timestamp_ms);
        const hours = Math.floor(toNumber(d.total_work_hours_ms) / 3600000);
        return {
            icon: "⚡",
            title: `Stats Update`,
            subtitle: `Prod ${d.total_production || 0} | Eff ${d.efficiency_score || 0}% | Hours ${hours}h`,
            timestamp: ts,
        } as UnifiedItem;
    });

    const unified: UnifiedItem[] = [...unifyDoor, ...unifyMachine, ...unifyClock, ...unifyProduction, ...unifyStats]
        .filter((i) => i.timestamp > 0)
        .sort((a, b) => b.timestamp - a.timestamp);

    // decode removed (unused after refactor)

    return (
        <div className="activity-section activity-timeline">
            <div className="activity-card">
                <h3>🧾 All Activity</h3>
                <div className="activity-list">
                    {unified.length === 0 ? (
                        <p className="no-data">No activity yet</p>
                    ) : (
                        unified.slice(0, 40).map((item, i) => (
                            <div key={`un-${i}-${item.timestamp}`} className="activity-item">
                                <span className="activity-icon">{item.icon}</span>
                                <div className="activity-details">
                                    <span className="activity-title">{item.title}</span>
                                    {item.subtitle && <span className="activity-subtitle">{item.subtitle}</span>}
                                    <span className="activity-time">{new Date(item.timestamp).toLocaleString("tr-TR")}</span>
                                </div>
                                {item.badge && <span className={`activity-badge ${item.badgeClass || ""}`}>{item.badge}</span>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ActivityTimeline;
