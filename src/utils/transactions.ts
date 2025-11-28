/**
 * Sui Transaction Builder Fonksiyonları
 * Smart contract ile etkileşim için transaction builder'lar
 */

import { Transaction } from '@mysten/sui/transactions'
import { CONTRACT_CONFIG, getModuleId } from '../config/contracts'
import type {
  RegisterDoorForm,
  RegisterMachineForm,
  IssueWorkerCardForm,
  RecordMachineUsageForm,
  IssueAwardForm,
  UpdateWorkerCardForm,
  UpdateDoorForm,
  UpdateMachineForm,
  BatchRegisterDoorsForm,
  BatchRegisterMachinesForm,
  BatchIssueWorkerCardsForm,
} from '../types/identity'

/**
 * Text'i UTF-8 byte array'e çevir
 */
function stringToBytes(str: string): number[] {
  return Array.from(new TextEncoder().encode(str))
}

// ============ Admin Functions ============

/**
 * Yeni worker card oluştur
 */
export function buildIssueWorkerCardTx(
  adminCapId: string,
  form: IssueWorkerCardForm
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::issue_worker_card`,
    arguments: [
      tx.object(adminCapId),
      tx.pure.address(form.worker_address),
      tx.pure.vector('u8', stringToBytes(form.card_number)),
      tx.pure.vector('u8', stringToBytes(form.name)),
      tx.pure.vector('u8', stringToBytes(form.department)),
    ],
  })
  
  return tx
}

/**
 * Yeni kapı kaydet
 */
export function buildRegisterDoorTx(form: RegisterDoorForm): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::register_door`,
    arguments: [
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.vector('u8', stringToBytes(form.name)),
      tx.pure.vector('u8', stringToBytes(form.location)),
    ],
  })
  
  return tx
}

/**
 * Yeni makine/kaynak kaydet
 */
export function buildRegisterMachineTx(form: RegisterMachineForm): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::register_machine`,
    arguments: [
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.vector('u8', stringToBytes(form.name)),
      tx.pure.vector('u8', stringToBytes(form.machine_type)),
    ],
  })
  
  return tx
}

/**
 * Ödül ver
 */
export function buildIssueAwardTx(
  adminCapId: string,
  workerCardId: string,
  form: IssueAwardForm
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::issue_award`,
    arguments: [
      tx.object(adminCapId),
      tx.object(workerCardId),
      tx.pure.vector('u8', stringToBytes(form.award_type)),
      tx.pure.u64(form.points),
      tx.pure.vector('u8', stringToBytes(form.description)),
    ],
  })
  
  return tx
}

// ============ Worker Functions ============

/**
 * Kapı geçişi kaydet
 */
export function buildRecordDoorAccessTx(
  workerCardId: string,
  doorId: number,
  accessType: number // 0 = entry, 1 = exit
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::record_door_access`,
    arguments: [
      tx.object(workerCardId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.u64(doorId),
      tx.pure.u8(accessType),
    ],
  })
  
  return tx
}

/**
 * Makine kullanımı kaydet
 */
export function buildRecordMachineUsageTx(
  workerCardId: string,
  form: RecordMachineUsageForm
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::record_machine_usage`,
    arguments: [
      tx.object(workerCardId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.u64(form.machine_id),
      tx.pure.u64(form.usage_duration_ms),
      tx.pure.u64(form.production_count),
      tx.pure.u64(form.efficiency_percentage),
    ],
  })
  
  return tx
}

/**
 * Mesai giriş/çıkış
 */
export function buildClockInOutTx(
  workerCardId: string,
  actionType: number // 0 = clock in, 1 = clock out
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::clock_in_out`,
    arguments: [
      tx.object(workerCardId),
      tx.pure.u8(actionType),
    ],
  })
  
  return tx
}

// ============ View Functions ============

/**
 * Worker stats getir (view fonksiyon)
 */
export function buildGetWorkerStatsTx(workerCardId: string): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::get_worker_stats`,
    arguments: [tx.object(workerCardId)],
  })
  
  return tx
}

/**
 * Worker bilgilerini getir (view fonksiyon)
 */
export function buildGetWorkerInfoTx(workerCardId: string): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::get_worker_info`,
    arguments: [tx.object(workerCardId)],
  })
  
  return tx
}

/**
 * Kapı bilgilerini getir
 */
export function buildGetDoorTx(doorId: number): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::get_door`,
    arguments: [
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.u64(doorId),
    ],
  })
  
  return tx
}

/**
 * Makine bilgilerini getir
 */
export function buildGetMachineTx(machineId: number): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::get_machine`,
    arguments: [
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.u64(machineId),
    ],
  })
  
  return tx
}

// ============ Update Functions ============

/**
 * Worker Card bilgilerini güncelle
 */
export function buildUpdateWorkerCardTx(
  adminCapId: string,
  workerCardId: string,
  form: UpdateWorkerCardForm
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::update_worker_card`,
    arguments: [
      tx.object(adminCapId),
      tx.object(workerCardId),
      tx.pure.vector('u8', stringToBytes(form.name)),
      tx.pure.vector('u8', stringToBytes(form.department)),
    ],
  })
  
  return tx
}

/**
 * Kapı bilgilerini güncelle
 */
export function buildUpdateDoorTx(
  adminCapId: string,
  doorId: number,
  form: UpdateDoorForm
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::update_door`,
    arguments: [
      tx.object(adminCapId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.u64(doorId),
      tx.pure.vector('u8', stringToBytes(form.name)),
      tx.pure.vector('u8', stringToBytes(form.location)),
    ],
  })
  
  return tx
}

/**
 * Makine bilgilerini güncelle
 */
export function buildUpdateMachineTx(
  adminCapId: string,
  machineId: number,
  form: UpdateMachineForm
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::update_machine`,
    arguments: [
      tx.object(adminCapId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.u64(machineId),
      tx.pure.vector('u8', stringToBytes(form.name)),
      tx.pure.vector('u8', stringToBytes(form.machine_type)),
    ],
  })
  
  return tx
}

// ============ Activate/Deactivate Functions ============

/**
 * Worker Card'ı devre dışı bırak
 */
export function buildDeactivateWorkerCardTx(
  adminCapId: string,
  workerCardId: string
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::deactivate_worker_card`,
    arguments: [
      tx.object(adminCapId),
      tx.object(workerCardId),
    ],
  })
  
  return tx
}

/**
 * Worker Card'ı aktif et
 */
export function buildActivateWorkerCardTx(
  adminCapId: string,
  workerCardId: string
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::activate_worker_card`,
    arguments: [
      tx.object(adminCapId),
      tx.object(workerCardId),
    ],
  })
  
  return tx
}

/**
 * Kapıyı devre dışı bırak
 */
export function buildDeactivateDoorTx(
  adminCapId: string,
  doorId: number
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::deactivate_door`,
    arguments: [
      tx.object(adminCapId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.u64(doorId),
    ],
  })
  
  return tx
}

/**
 * Kapıyı aktif et
 */
export function buildActivateDoorTx(
  adminCapId: string,
  doorId: number
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::activate_door`,
    arguments: [
      tx.object(adminCapId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.u64(doorId),
    ],
  })
  
  return tx
}

/**
 * Makineyi devre dışı bırak
 */
export function buildDeactivateMachineTx(
  adminCapId: string,
  machineId: number
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::deactivate_machine`,
    arguments: [
      tx.object(adminCapId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.u64(machineId),
    ],
  })
  
  return tx
}

/**
 * Makineyi aktif et
 */
export function buildActivateMachineTx(
  adminCapId: string,
  machineId: number
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::activate_machine`,
    arguments: [
      tx.object(adminCapId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.u64(machineId),
    ],
  })
  
  return tx
}

// ============ Batch Operations ============

/**
 * Toplu kapı kaydı
 */
export function buildBatchRegisterDoorsTx(
  adminCapId: string,
  form: BatchRegisterDoorsForm
): Transaction {
  const tx = new Transaction()
  
  const names = form.names.map(name => stringToBytes(name))
  const locations = form.locations.map(loc => stringToBytes(loc))
  
  tx.moveCall({
    target: `${getModuleId()}::batch_register_doors`,
    arguments: [
      tx.object(adminCapId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.vector('vector<u8>', names),
      tx.pure.vector('vector<u8>', locations),
    ],
  })
  
  return tx
}

/**
 * Toplu makine kaydı
 */
export function buildBatchRegisterMachinesTx(
  adminCapId: string,
  form: BatchRegisterMachinesForm
): Transaction {
  const tx = new Transaction()
  
  const names = form.names.map(name => stringToBytes(name))
  const types = form.machine_types.map(type => stringToBytes(type))
  
  tx.moveCall({
    target: `${getModuleId()}::batch_register_machines`,
    arguments: [
      tx.object(adminCapId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.vector('vector<u8>', names),
      tx.pure.vector('vector<u8>', types),
    ],
  })
  
  return tx
}

/**
 * Toplu worker card oluştur
 */
export function buildBatchIssueWorkerCardsTx(
  adminCapId: string,
  form: BatchIssueWorkerCardsForm
): Transaction {
  const tx = new Transaction()
  
  const cardNumbers = form.card_numbers.map(cn => stringToBytes(cn))
  const names = form.names.map(name => stringToBytes(name))
  const departments = form.departments.map(dept => stringToBytes(dept))
  
  tx.moveCall({
    target: `${getModuleId()}::batch_issue_worker_cards`,
    arguments: [
      tx.object(adminCapId),
      tx.pure.vector('address', form.worker_addresses),
      tx.pure.vector('vector<u8>', cardNumbers),
      tx.pure.vector('vector<u8>', names),
      tx.pure.vector('vector<u8>', departments),
    ],
  })
  
  return tx
}

/**
 * AdminCap transfer et (yeni admin oluştur)
 */
export function buildTransferAdminCapTx(
  adminCapId: string,
  newAdminAddress: string
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::transfer_admin_cap`,
    arguments: [
      tx.object(adminCapId),
      tx.pure.address(newAdminAddress),
    ],
  })
  
  return tx
}
