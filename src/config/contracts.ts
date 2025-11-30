export const NETWORK = "testnet";

export const CONTRACT_CONFIG = {
    PACKAGE_ID: "0xfdf14bd97ecbcc808ea9a010d7d8120bbfbe973938705c25df65ef473eee4e19",
    SYSTEM_REGISTRY_ID: "0x8b3ab9c11b1e76099648ae16b09c2c657e6a935422e567432c0fa4e8a6555f8f",
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
