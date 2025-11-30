export const NETWORK = "testnet";

export const CONTRACT_CONFIG = {
    PACKAGE_ID: "0xcabe4a6fea6761edb4449bc65f26fdd8b6f388c4735dd5c4c2eb47f422761748",
    SYSTEM_REGISTRY_ID: "0x53a98053bf6bf23200206297c0c6c8f7d5e32b23386a02c9cb79281c1bcbfdc9",
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
