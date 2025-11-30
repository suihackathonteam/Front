export const NETWORK = "testnet";

export const CONTRACT_CONFIG = {
    PACKAGE_ID: "0xe1b9a5b5fc280a186e6b37176fb8f9009da4647f074e0a0efa78bc583973e340",
    SYSTEM_REGISTRY_ID: "0xfd9fe419b3f52b7f714142797c639d959e24621bbad5b70d249615a6d6d143e5",
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
