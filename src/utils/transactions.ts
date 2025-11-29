/**
 * Sui Transaction Builder Functions
 * Transaction builders for interacting with the smart contract
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
 * Convert text to a UTF-8 byte array
 */
function stringToBytes(str: string): number[] {
  return Array.from(new TextEncoder().encode(str))
}

// ============ Admin Functions ============

/**
 * Create a new worker card
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
 * Register a new door
 */
export function buildRegisterDoorTx(adminCapId: string, form: RegisterDoorForm): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::register_door`,
    arguments: [
      tx.object(adminCapId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.vector('u8', stringToBytes(form.name)),
      tx.pure.vector('u8', stringToBytes(form.location)),
    ],
  })
  
  return tx
}

/**
 * Register a new machine/resource
 */
export function buildRegisterMachineTx(adminCapId: string, form: RegisterMachineForm): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::register_machine`,
    arguments: [
      tx.object(adminCapId),
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.vector('u8', stringToBytes(form.name)),
      tx.pure.vector('u8', stringToBytes(form.machine_type)),
    ],
  })
  
  return tx
}

/**
 * Issue an award
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
      tx.object(CONTRACT_CONFIG.SYSTEM_REGISTRY_ID),
      tx.pure.vector('u8', stringToBytes(form.award_type)),
      tx.pure.u64(form.points),
      tx.pure.vector('u8', stringToBytes(form.description)),
    ],
  })
  
  return tx
}

// ============ Worker Functions ============

/**
 * Record a door access event
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
 * Record machine usage
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
 * Clock in / clock out (work shifts)
 */
export function buildClockInOutTx(
  workerCardId: string,
  registryId: string,
  actionType: number // 0 = clock in, 1 = clock out
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::clock_in_out`,
    arguments: [
      tx.object(workerCardId),
      tx.object(registryId),
      tx.pure.u8(actionType),
    ],
  })
  
  return tx
}

// ============ View Functions ============

/**
 * Get worker stats (view function)
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
 * Get worker information (view function)
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
 * Get door information
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
 * Get machine information
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
 * Update worker card information
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
 * Update door information
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
 * Update machine information
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
 * Deactivate a worker card
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
 * Activate a worker card
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
 * Deactivate a door
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
 * Activate a door
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
 * Deactivate a machine
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
 * Activate a machine
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
 * Batch register doors
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
 * Batch register machines
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
 * Batch issue worker cards
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
 * Create new admin using add_new_admin function
 */
export function buildAddNewAdminTx(
  adminCapId: string,
  newAdminAddress: string
): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${getModuleId()}::add_new_admin`,
    arguments: [
      tx.object(adminCapId),
      tx.pure.address(newAdminAddress),
    ],
  })
  
  return tx
}

/**
 * Transfer AdminCap (assign new admin) - transfers ownership
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
