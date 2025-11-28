/**
 * Smart Contract Konfigürasyonu
 * Deploy edildikten sonra contract adreslerini buraya ekleyin
 */

export const NETWORK = 'testnet' // 'localnet' | 'devnet' | 'testnet' | 'mainnet'

// Deploy edildikten sonra buraya eklenecek
export const CONTRACT_CONFIG = {
  // Package ID - Contract deploy edildikten sonra
  PACKAGE_ID: '0x6735004c7363423c1c35f144021ebadbd2d6c249c3b8f5b702bd1a4c058cd234',
  
  // Shared Objects
  SYSTEM_REGISTRY_ID: '0xdef066e16cea55487c140e2b477ffa0b29e46facfe052b560238efae7b25992a',
  
  // Module adı
  MODULE_NAME: 'identity',
}

// Action type constants (contract ile aynı)
export const ACTION_TYPES = {
  CLOCK_IN: 0,
  CLOCK_OUT: 1,
  DOOR_ENTRY: 2,
  DOOR_EXIT: 3,
} as const

// Event türleri (indexer için)
export const EVENT_TYPES = {
  DOOR_ACCESS: 'DoorAccessEvent',
  MACHINE_USAGE: 'MachineUsageEvent',
  CLOCK: 'ClockEvent',
  AWARD: 'AwardEvent',
  STATS_UPDATE: 'StatsUpdateEvent',
} as const

// Utility fonksiyonlar
export const getModuleId = () => `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}`

export const isContractConfigured = () => {
  return CONTRACT_CONFIG.PACKAGE_ID !== '0x...' && 
         CONTRACT_CONFIG.SYSTEM_REGISTRY_ID !== '0x...'
}
