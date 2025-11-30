interface ShiftControlsProps {
    shiftActive: boolean;
    txLoading: boolean;
    onClockIn: () => Promise<void> | void;
    onClockOut: () => Promise<void> | void;
    productionUnits: number;
    onChangeProductionUnits: (v: number) => void;
    onIncrementProduction: () => void;
    onDoorEntry?: () => Promise<void> | void;
    onDoorExit?: () => Promise<void> | void;
}

function ShiftControls({
    shiftActive,
    txLoading,
    onClockIn,
    onClockOut,
    productionUnits,
    onChangeProductionUnits,
    onIncrementProduction,
    onDoorEntry,
    onDoorExit,
}: ShiftControlsProps) {
    return (
        <div className="quick-actions shift-controls">
            <button
                className={`clock-btn clock-in ${shiftActive ? "disabled-shift" : ""}`}
                onClick={onClockIn}
                disabled={txLoading || shiftActive}
                title={txLoading ? "Transaction in progress..." : shiftActive ? "Already in an active shift" : "Start shift"}
                style={{
                    opacity: shiftActive ? 0.5 : 1,
                    cursor: shiftActive || txLoading ? "not-allowed" : "pointer",
                }}
            >
                {txLoading && !shiftActive ? "⏳ " : ""}🕐 Clock In
            </button>
            <button
                className={`clock-btn clock-out ${!shiftActive ? "disabled-shift" : ""}`}
                onClick={onClockOut}
                disabled={txLoading || !shiftActive}
                title={txLoading ? "Transaction in progress..." : !shiftActive ? "No active shift" : "End shift"}
                style={{
                    opacity: !shiftActive ? 0.5 : 1,
                    cursor: !shiftActive || txLoading ? "not-allowed" : "pointer",
                }}
            >
                {txLoading && shiftActive ? "⏳ " : ""}🕐 Clock Out
            </button>
            <div className="production-inline-form">
                <input
                    type="number"
                    min={1}
                    value={productionUnits}
                    onChange={(e) => onChangeProductionUnits(Number(e.target.value))}
                    placeholder="Units"
                    disabled={!shiftActive || txLoading}
                    title={!shiftActive ? "Start shift first" : "Production units"}
                    style={{ width: "100px" }}
                />
                <button
                    className="prod-btn"
                    onClick={onIncrementProduction}
                    disabled={!shiftActive || txLoading || productionUnits <= 0}
                    title={!shiftActive ? "Start shift first" : "Record production"}
                >
                    📦 Record Production
                </button>
            </div>
            {onDoorEntry && (
                <button className="door-btn door-entry" onClick={onDoorEntry} disabled={txLoading} title="Door entry">
                    🔓 Entry
                </button>
            )}
            {onDoorExit && (
                <button className="door-btn door-exit" onClick={onDoorExit} disabled={txLoading} title="Door exit">
                    🔒 Exit
                </button>
            )}
        </div>
    );
}

export default ShiftControls;
