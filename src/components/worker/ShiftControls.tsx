interface ShiftControlsProps {
    shiftActive: boolean;
    txLoading: boolean;
    onClockIn: () => Promise<void> | void;
    onClockOut: () => Promise<void> | void;
    productionUnits: number;
    efficiencyPercentage: number;
    onChangeProductionUnits: (v: number) => void;
    onChangeEfficiency: (v: number) => void;
    onIncrementProduction: () => void;
    onQuickAdd?: () => void;
    onDoorEntry?: () => Promise<void> | void;
    onDoorExit?: () => Promise<void> | void;
}

function ShiftControls({
    shiftActive,
    txLoading,
    onClockIn,
    onClockOut,
    productionUnits,
    efficiencyPercentage,
    onChangeProductionUnits,
    onChangeEfficiency,
    onIncrementProduction,
    onQuickAdd,
    onDoorEntry,
    onDoorExit,
}: ShiftControlsProps) {
    return (
        <div className="quick-actions shift-controls">
            <button
                className="clock-btn clock-in"
                onClick={onClockIn}
                disabled={txLoading || shiftActive}
                title={shiftActive ? "A shift is already active" : "Start shift"}
            >
                🕐 Start Shift
            </button>
            <button
                className="clock-btn clock-out"
                onClick={onClockOut}
                disabled={txLoading || !shiftActive}
                title={!shiftActive ? "No active shift" : "End shift"}
            >
                🕐 End Shift
            </button>
            <div className="production-inline-form">
                <input
                    type="number"
                    min={1}
                    value={productionUnits}
                    onChange={(e) => onChangeProductionUnits(Number(e.target.value))}
                    placeholder="Units"
                    disabled={!shiftActive || txLoading}
                />
                <button className="quick-add-btn" onClick={onQuickAdd} disabled={!shiftActive || txLoading || productionUnits <= 0} title="Quick add 1 unit">
                    +
                </button>
                <input
                    type="number"
                    min={0}
                    max={100}
                    value={efficiencyPercentage}
                    onChange={(e) => onChangeEfficiency(Number(e.target.value))}
                    placeholder="Eff%"
                    disabled={!shiftActive || txLoading}
                />
                <button
                    className="prod-btn"
                    onClick={onIncrementProduction}
                    disabled={!shiftActive || txLoading || productionUnits <= 0}
                    title={!shiftActive ? "Start a shift first" : "Record production"}
                >
                    📦 Record
                </button>
            </div>
            {onDoorEntry && (
                <button className="door-btn door-entry" onClick={onDoorEntry} disabled={txLoading}>
                    🚪 Entry
                </button>
            )}
            {onDoorExit && (
                <button className="door-btn door-exit" onClick={onDoorExit} disabled={txLoading}>
                    🚪 Exit
                </button>
            )}
        </div>
    );
}

export default ShiftControls;
