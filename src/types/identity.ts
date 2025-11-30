export interface WorkerCard {
    id: string;
    worker_address: string;
    card_number: string;
    name: string;
    department: string;
    is_active: boolean;
    total_work_hours: number;
    total_production: number;
    efficiency_score: number;
    last_checkpoint_hash: number[];
    current_shift_start_ms: number;
    is_in_shift: boolean;
}

export interface Door {
    door_id: number;
    name: string;
    location: string;
    is_active: boolean;
}

export interface Machine {
    machine_id: number;
    name: string;
    machine_type: string; // existing field used for contract compatibility
    category?: string; // UI-level category field for future contract update
    location: string;
    is_active: boolean;
    total_usage_time_ms?: number;
    total_production?: number;
}

export interface DoorAccessEvent {
    worker_address: string;
    card_number: string;
    door_id: number;
    door_name: string;
    access_type: number;
    timestamp_ms: number;
}

export interface MachineUsageEvent {
    worker_address: string;
    card_number: string;
    machine_id: number;
    machine_name: string;
    usage_duration_ms: number;
    production_count: number;
    efficiency_percentage: number;
    timestamp_ms: number;
}

export interface ClockEvent {
    worker_address: string;
    card_number: string;
    action_type: number;
    timestamp_ms: number;
}

export interface AwardEvent {
    worker_address: string;
    card_number: string;
    award_type: string;
    points: number;
    description: string;
    timestamp_ms: number;
}

export interface StatsUpdateEvent {
    worker_address: string;
    total_work_hours_ms: number;
    total_production: number;
    efficiency_score: number;
    checkpoint_hash: number[];
    timestamp_ms: number;
}

export interface ProductionIncrementEvent {
    worker_address: string;
    card_number: string;
    production_units: number;
    efficiency_percentage: number;
    timestamp_ms: number;
}
export interface RegisterDoorForm {
    name: string;
    location: string;
}

export interface RegisterMachineForm {
    name: string;
    machine_type: string;
    category?: string;
    location: string;
}

export interface IssueWorkerCardForm {
    worker_address: string;
    card_number: string;
    name: string;
    department: string;
}

export interface RecordMachineUsageForm {
    machine_id: number;
    usage_duration_ms: number;
    production_count: number;
    efficiency_percentage: number;
}

export interface IssueAwardForm {
    award_type: string;
    points: number;
    description: string;
}

export interface UpdateWorkerCardForm {
    name: string;
    department: string;
}

export interface UpdateDoorForm {
    name: string;
    location: string;
}

export interface UpdateMachineForm {
    name: string;
    machine_type: string;
    category?: string;
    location: string;
}

export interface BatchRegisterDoorsForm {
    names: string[];
    locations: string[];
}

export interface BatchRegisterMachinesForm {
    names: string[];
    machine_types: string[];
    locations: string[];
}

export interface BatchIssueWorkerCardsForm {
    worker_addresses: string[];
    card_numbers: string[];
    names: string[];
    departments: string[];
}

export interface WorkerStats {
    address: string;
    name: string;
    card_number: string;
    department: string;
    work_hours_formatted: string;
    total_production: number;
    efficiency_score: number;
    last_activity: Date | null;
}

export interface DoorActivity {
    id: string;
    worker_name: string;
    worker_address: string;
    door_name: string;
    access_type: "entry" | "exit";
    timestamp: Date;
    card_number: string;
}

export interface MachineActivity {
    id: string;
    worker_name: string;
    machine_name: string;
    duration_formatted: string;
    production: number;
    efficiency: number;
    timestamp: Date;
}
