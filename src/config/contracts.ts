export const NETWORK = "testnet";

export const CONTRACT_CONFIG = {
    PACKAGE_ID: "0x143d0098ff19457b480cd67863da6879d38b51cfb1f22c3b5cacb62cc1249be9",
    SYSTEM_REGISTRY_ID: "0xeb408decd861de9988f3ed4f9167af122b85d0c991119c3070d0532ec7c3480a",
    ADMIN_CAP_ID: "0x8c2a237e4ebb4d2ea53ef8a9102d707d234c1e39fee5c450f3b92987550c24fa",
    MODULE_NAME: "identity",
};

export const ACTION_TYPES = {
    CLOCK_IN: 0,
    CLOCK_OUT: 1,
    DOOR_ENTRY: 2,
    DOOR_EXIT: 3,
} as const;

export const EVENT_TYPES = {
    DOOR_ACCESS: "DoorAccessEvent",
    MACHINE_USAGE: "MachineUsageEvent",
    CLOCK: "ClockEvent",
    AWARD: "AwardEvent",
    STATS_UPDATE: "StatsUpdateEvent",
} as const;

export const getModuleId = () => `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}`;

export const isContractConfigured = () => {
    return CONTRACT_CONFIG.PACKAGE_ID !== "0x..." && CONTRACT_CONFIG.SYSTEM_REGISTRY_ID !== "0x...";
};
