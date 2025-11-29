export const NETWORK = 'testnet'

export const CONTRACT_CONFIG = {

  PACKAGE_ID: '0x35dfa58832031aee3c01b196598cc6ffa4fa5f0ee0f7850c5ed45bd2dd4ba7fe',
  SYSTEM_REGISTRY_ID: '0x2882c04a0c273ccd72fd1818aebbf24183c60e1cf9645905aaa8c0298718a145',
  MODULE_NAME: 'identity',
}

export const ACTION_TYPES = {
  CLOCK_IN: 0,
  CLOCK_OUT: 1,
  DOOR_ENTRY: 2,
  DOOR_EXIT: 3,
} as const

export const EVENT_TYPES = {
  DOOR_ACCESS: 'DoorAccessEvent',
  MACHINE_USAGE: 'MachineUsageEvent',
  CLOCK: 'ClockEvent',
  AWARD: 'AwardEvent',
  STATS_UPDATE: 'StatsUpdateEvent',
} as const

export const getModuleId = () => `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}`

export const isContractConfigured = () => {
  return CONTRACT_CONFIG.PACKAGE_ID !== '0x...' && 
         CONTRACT_CONFIG.SYSTEM_REGISTRY_ID !== '0x...'
}
