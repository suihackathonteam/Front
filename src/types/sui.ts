/**
 * Type definitions for Sui blockchain data structures
 */

export interface SuiMoveObjectFields {
    [key: string]: unknown;
    worker_address?: string;
    card_number?: number[];
    name?: number[];
    department?: number[];
    is_active?: boolean;
    total_work_hours?: string | number;
    total_production?: string | number;
    efficiency_score?: string | number;
    last_checkpoint_hash?: number[];
    door_name?: number[];
    location?: number[];
    machine_name?: number[];
    machine_type?: number[];
    door_access_history?: unknown;
    machine_usage_history?: unknown;
    shift_history?: unknown;
    award_history?: unknown;
}

export interface DoorAccessHistoryItem {
    door_id?: string;
    door_name?: string | number[];
    timestamp?: string | number;
    timestamp_ms?: string | number;
    is_entry?: boolean;
    access_type?: number | string;
}

export interface MachineUsageHistoryItem {
    machine_id?: string;
    machine_name?: string | number[];
    timestamp?: string | number;
    timestamp_ms?: string | number;
    production_count?: string | number;
    efficiency_percentage?: string | number;
}

export interface ShiftHistoryItem {
    clock_in_time?: string | number;
    clock_out_time?: string | number;
    work_duration?: string | number;
    action_type?: number | string;
    timestamp_ms?: string | number;
}

export interface AwardHistoryItem {
    award_type?: string | number[];
    award_name?: string | number[];
    description?: string | number[];
    points?: string | number;
    timestamp_ms?: string | number;
}

export interface EventData {
    parsedJson?: Record<string, unknown>;
    timestampMs?: string | null;
    id?: unknown;
    packageId?: string;
    sender?: string;
    type?: string;
}

export interface RegistryFields {
    id?: { id?: string };
    admin?: string;
    total_workers?: string | number;
    total_doors?: string | number;
    total_machines?: string | number;
    doors?: { fields?: { id?: { id?: string } } };
    machines?: { fields?: { id?: { id?: string } } };
    door_counter?: string | number;
    machine_counter?: string | number;
    recent_door_access?: unknown[];
    recent_machine_usage?: unknown[];
    recent_shifts?: unknown[];
    recent_awards?: unknown[];
}
