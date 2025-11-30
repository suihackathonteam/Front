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
                className={`clock-btn clock-in ${shiftActive ? "disabled-shift" : ""}`}
                onClick={onClockIn}
                disabled={txLoading || shiftActive}
                title={txLoading ? "İşlem devam ediyor..." : shiftActive ? "Zaten aktif bir mesai var" : "Mesaiyi başlat"}
                style={{
                    opacity: shiftActive ? 0.5 : 1,
                    cursor: shiftActive || txLoading ? "not-allowed" : "pointer",
                }}
            >
                {txLoading && !shiftActive ? "⏳ " : ""}🕐 Mesai Başlat
            </button>
            <button
                className={`clock-btn clock-out ${!shiftActive ? "disabled-shift" : ""}`}
                onClick={onClockOut}
                disabled={txLoading || !shiftActive}
                title={txLoading ? "İşlem devam ediyor..." : !shiftActive ? "Aktif mesai yok" : "Mesaiyi bitir"}
                style={{
                    opacity: !shiftActive ? 0.5 : 1,
                    cursor: !shiftActive || txLoading ? "not-allowed" : "pointer",
                }}
            >
                {txLoading && shiftActive ? "⏳ " : ""}🕐 Mesai Bitir
            </button>
            <div className="production-inline-form">
                <input
                    type="number"
                    min={1}
                    value={productionUnits}
                    onChange={(e) => onChangeProductionUnits(Number(e.target.value))}
                    placeholder="Birim"
                    disabled={!shiftActive || txLoading}
                    title={!shiftActive ? "Önce mesai başlatın" : "Üretim birimi"}
                />
                <button
                    className="quick-add-btn"
                    onClick={onQuickAdd}
                    disabled={!shiftActive || txLoading || productionUnits <= 0}
                    title={!shiftActive ? "Önce mesai başlatın" : "Hızlı +1 birim ekle"}
                >
                    +
                </button>
                <input
                    type="number"
                    min={0}
                    max={100}
                    value={efficiencyPercentage}
                    onChange={(e) => onChangeEfficiency(Number(e.target.value))}
                    placeholder="Verim%"
                    disabled={!shiftActive || txLoading}
                    title={!shiftActive ? "Önce mesai başlatın" : "Verimlilik yüzdesi"}
                />
                <button
                    className="prod-btn"
                    onClick={onIncrementProduction}
                    disabled={!shiftActive || txLoading || productionUnits <= 0}
                    title={!shiftActive ? "Önce mesai başlatın" : "Üretimi kaydet"}
                >
                    📦 Kaydet
                </button>
            </div>
            {onDoorEntry && (
                <button className="door-btn door-entry" onClick={onDoorEntry} disabled={txLoading} title="Kapı girişi">
                    🚪 Giriş
                </button>
            )}
            {onDoorExit && (
                <button className="door-btn door-exit" onClick={onDoorExit} disabled={txLoading} title="Kapı çıkışı">
                    🚪 Çıkış
                </button>
            )}
        </div>
    );
}

export default ShiftControls;
