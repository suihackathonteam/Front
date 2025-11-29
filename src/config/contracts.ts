export const NETWORK = "testnet";

export const CONTRACT_CONFIG = {
    PACKAGE_ID: "0x2ec4d8b38ec3b618711bc5ef69689dd68cfe9ab87f4492776dac16f0b9482234",
    SYSTEM_REGISTRY_ID: "0x3a093fed3be8fb7244469edc49e832be19a9b5a79b669a26d65d8526f443d1ae",
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
