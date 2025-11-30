/**
 * Custom Hooks for the Identity System
 * React hooks for interacting with the blockchain
 */

import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui/client";
import { useState, useEffect, useCallback } from "react";
import { CONTRACT_CONFIG } from "../config/contracts";
import type { WorkerCard, Door, Machine } from "../types/identity";
import type { Transaction } from "@mysten/sui/transactions";
import type {
    SuiMoveObjectFields,
    EventData,
    RegistryFields,
    DoorAccessHistoryItem,
    MachineUsageHistoryItem,
    ShiftHistoryItem,
    AwardHistoryItem,
} from "../types/sui";

/**
 * Worker Card hook - retrieves the user's worker card
 */
export function useWorkerCard() {
    const account = useCurrentAccount();
    const client = useSuiClient();
    const [workerCard, setWorkerCard] = useState<WorkerCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchWorkerCard = useCallback(async () => {
        if (!account?.address) {
            setWorkerCard(null);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const objects = await client.getOwnedObjects({
                owner: account.address,
                filter: {
                    StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::identity::WorkerCard`,
                },
                options: { showContent: true },
            });
            if (objects.data.length > 0) {
                const cardData = objects.data[0].data as SuiObjectData;
                if (cardData.content && cardData.content.dataType === "moveObject") {
                    const fields = cardData.content.fields as SuiMoveObjectFields;
                    const decoder = new TextDecoder();
                    setWorkerCard({
                        id: cardData.objectId,
                        worker_address: fields.worker_address || "",
                        card_number: fields.card_number ? decoder.decode(new Uint8Array(fields.card_number)) : "",
                        name: fields.name ? decoder.decode(new Uint8Array(fields.name)) : "",
                        department: fields.department ? decoder.decode(new Uint8Array(fields.department)) : "",
                        is_active: fields.is_active ?? false,
                        total_work_hours: Number(fields.total_work_hours || 0),
                        total_production: Number(fields.total_production || 0),
                        efficiency_score: Number(fields.efficiency_score || 0),
                        last_checkpoint_hash: fields.last_checkpoint_hash || [],
                        current_shift_start_ms: Number(fields.current_shift_start_ms || 0),
                        is_in_shift: Boolean(fields.is_in_shift),
                    });
                }
            } else {
                setWorkerCard(null);
            }
        } catch (err) {
            console.error("Error fetching worker card:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [account?.address, client]);

    useEffect(() => {
        fetchWorkerCard();
    }, [fetchWorkerCard]);

    return { workerCard, loading, error, refetch: fetchWorkerCard };
}

/**
 * Admin Cap hook - checks whether the user has admin privileges
 */
export function useAdminCap() {
    const account = useCurrentAccount();
    const client = useSuiClient();
    const [adminCapId, setAdminCapId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!account?.address) {
            setIsAdmin(false);
            setAdminCapId(null);
            setLoading(false);
            return;
        }

        const checkAdmin = async () => {
            try {
                setLoading(true);

                const objects = await client.getOwnedObjects({
                    owner: account.address,
                    filter: {
                        StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::identity::AdminCap`,
                    },
                });

                if (objects.data.length > 0) {
                    setIsAdmin(true);
                    setAdminCapId(objects.data[0].data?.objectId || null);
                } else {
                    setIsAdmin(false);
                    setAdminCapId(null);
                }
            } catch (err) {
                console.error("Error checking admin cap:", err);
                setIsAdmin(false);
                setAdminCapId(null);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [account?.address, client]);

    return { isAdmin, adminCapId, loading };
}

/**
 * Transaction hook - sending transactions
 */
export function useIdentityTransaction() {
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const executeTransaction = useCallback(
        async (tx: string | Transaction, options?: { onSuccess?: () => void; onError?: (error: string) => void }) => {
            console.log("🔄 executeTransaction called with:", { tx, options });
            setIsLoading(true);
            setError(null);

            signAndExecute(
                {
                    transaction: tx,
                },
                {
                    onSuccess: (result) => {
                        console.log("✅ Transaction signed and executed:", result);
                        setIsLoading(false);
                        options?.onSuccess?.();
                    },
                    onError: (err) => {
                        console.error("❌ Transaction error:", err);
                        const errorMsg = err instanceof Error ? err.message : "Transaction failed";
                        setError(errorMsg);
                        setIsLoading(false);
                        options?.onError?.(errorMsg);
                    },
                }
            );
        },
        [signAndExecute]
    );

    return { executeTransaction, isLoading, error };
}

/**
 * Doors list hook
 */
export function useDoors() {
    const client = useSuiClient();
    const [doors, setDoors] = useState<Door[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDoors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch the SystemRegistry object
            const registry = await client.getObject({
                id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
                options: { showContent: true },
            });

            if (!registry.data?.content || registry.data.content.dataType !== "moveObject") {
                setDoors([]);
                return;
            }

            const fields = registry.data.content.fields as RegistryFields;
            const doorsTableId = fields.doors?.fields?.id?.id;

            if (!doorsTableId) {
                setDoors([]);
                return;
            }

            // Fetch dynamic fields (doors from the table)
            const dynamicFields = await client.getDynamicFields({
                parentId: doorsTableId,
            });

            const doorPromises = dynamicFields.data.map(async (field) => {
                try {
                    const doorObject = await client.getDynamicFieldObject({
                        parentId: doorsTableId,
                        name: field.name,
                    });

                    if (doorObject.data?.content && doorObject.data.content.dataType === "moveObject") {
                        const doorData = doorObject.data.content.fields as Record<string, unknown>;

                        // Data is in value.fields structure
                        const valueData = doorData.value as Record<string, unknown>;
                        const fields = valueData?.fields as Record<string, unknown>;

                        if (!fields) {
                            console.warn("Door fields not found:", doorData);
                            return null;
                        }

                        const decoder = new TextDecoder();

                        return {
                            door_id: Number(fields.door_id),
                            name: Array.isArray(fields.name) ? decoder.decode(new Uint8Array(fields.name as number[])) : String(fields.name || "Unknown Door"),
                            location: Array.isArray(fields.location)
                                ? decoder.decode(new Uint8Array(fields.location as number[]))
                                : String(fields.location || "Unknown Location"),
                            is_active: Boolean(fields.is_active),
                        } as Door;
                    }
                    return null;
                } catch (err) {
                    console.error("Error fetching door:", err);
                    return null;
                }
            });
            const doorsData = await Promise.all(doorPromises);
            setDoors(doorsData.filter((d): d is Door => d !== null));
        } catch (err) {
            console.error("Error fetching doors:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch doors");
        } finally {
            setLoading(false);
        }
    }, [client]);

    useEffect(() => {
        fetchDoors();
    }, [fetchDoors]);

    return { doors, loading, error, refetch: fetchDoors };
}

/**
 * Machines list hook
 */
export function useMachines() {
    const client = useSuiClient();
    const [machines, setMachines] = useState<Machine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMachines = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch the SystemRegistry object
            const registry = await client.getObject({
                id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
                options: { showContent: true },
            });

            if (!registry.data?.content || registry.data.content.dataType !== "moveObject") {
                setMachines([]);
                return;
            }

            const fields = registry.data.content.fields as RegistryFields;
            const machinesTableId = fields.machines?.fields?.id?.id;

            if (!machinesTableId) {
                setMachines([]);
                return;
            }

            // Fetch dynamic fields (machines from the table)
            const dynamicFields = await client.getDynamicFields({
                parentId: machinesTableId,
            });

            const machinePromises = dynamicFields.data.map(async (field) => {
                try {
                    const machineObject = await client.getDynamicFieldObject({
                        parentId: machinesTableId,
                        name: field.name,
                    });

                    if (machineObject.data?.content && machineObject.data.content.dataType === "moveObject") {
                        const machineData = machineObject.data.content.fields as Record<string, unknown>;

                        // Data is in value.fields structure
                        const valueData = machineData.value as Record<string, unknown>;
                        const fields = valueData?.fields as Record<string, unknown>;

                        if (!fields) {
                            console.warn("Machine fields not found:", machineData);
                            return null;
                        }

                        const decoder = new TextDecoder();

                        return {
                            machine_id: Number(fields.machine_id),
                            name: Array.isArray(fields.name)
                                ? decoder.decode(new Uint8Array(fields.name as number[]))
                                : String(fields.name || "Unknown Machine"),
                            machine_type: Array.isArray(fields.machine_type)
                                ? decoder.decode(new Uint8Array(fields.machine_type as number[]))
                                : String(fields.machine_type || "Unknown Type"),
                            location: Array.isArray(fields.location)
                                ? decoder.decode(new Uint8Array(fields.location as number[]))
                                : String(fields.location || "Unknown Location"),
                            is_active: Boolean(fields.is_active),
                            total_usage_time_ms: Number(fields.total_usage_time_ms || 0),
                            total_production: Number(fields.total_production || 0),
                        } as Machine;
                    }
                    return null;
                } catch (err) {
                    console.error("Error fetching machine:", err);
                    return null;
                }
            });

            const machinesData = await Promise.all(machinePromises);
            setMachines(machinesData.filter((m): m is Machine => m !== null));
        } catch (err) {
            console.error("Error fetching machines:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch machines");
        } finally {
            setLoading(false);
        }
    }, [client]);

    useEffect(() => {
        fetchMachines();
    }, [fetchMachines]);

    return { machines, loading, error, refetch: fetchMachines };
}

/**
 * Events hook - listen to blockchain events
 */
export function useIdentityEvents(eventType: string) {
    const client = useSuiClient();
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);

                if (eventType && eventType !== "*") {
                    // Query specific event type
                    const eventQuery = await client.queryEvents({
                        query: {
                            MoveEventType: `${CONTRACT_CONFIG.PACKAGE_ID}::identity::${eventType}`,
                        },
                        limit: 50,
                        order: "descending",
                    });
                    setEvents(eventQuery.data as EventData[]);
                } else {
                    // Query all event types
                    const eventTypes = ["DoorAccessEvent", "MachineUsageEvent", "ClockEvent", "AwardEvent", "ProductionIncrementEvent", "StatsUpdateEvent"];
                    const allEvents: EventData[] = [];

                    for (const type of eventTypes) {
                        try {
                            const eventQuery = await client.queryEvents({
                                query: {
                                    MoveEventType: `${CONTRACT_CONFIG.PACKAGE_ID}::identity::${type}`,
                                },
                                limit: 50,
                                order: "descending",
                            });
                            allEvents.push(...(eventQuery.data as EventData[]));
                        } catch (err) {
                            console.warn(`${type} event fetch error:`, err);
                        }
                    }

                    // Sort by timestamp descending
                    allEvents.sort((a, b) => Number(b.timestampMs) - Number(a.timestampMs));
                    setEvents(allEvents);
                }
            } catch (err) {
                console.error("Error fetching events:", err);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();

        // Refresh every 60 seconds (reduced from 10 seconds to reduce re-renders)
        const interval = setInterval(fetchEvents, 60000);
        return () => clearInterval(interval);
    }, [client, eventType]);

    return { events, loading };
}

/**
 * Worker's door access history hook
 */
export function useWorkerDoorAccessHistory(workerCardId?: string) {
    const client = useSuiClient();
    const [doorAccessHistory, setDoorAccessHistory] = useState<DoorAccessHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!workerCardId) return;

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const card = await client.getObject({
                    id: workerCardId,
                    options: { showContent: true },
                });

                if (card.data?.content && card.data.content.dataType === "moveObject") {
                    const fields = card.data.content.fields as SuiMoveObjectFields;
                    const doorHistory = Array.isArray(fields.door_access_history) ? (fields.door_access_history as DoorAccessHistoryItem[]) : [];
                    setDoorAccessHistory(doorHistory);
                }
            } catch (err) {
                console.error("Door access history fetch error:", err);
                setDoorAccessHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [workerCardId, client]);

    return { doorAccessHistory, loading };
}

/**
 * Worker's machine usage history hook
 */
export function useWorkerMachineUsageHistory(workerCardId?: string) {
    const client = useSuiClient();
    const [machineUsageHistory, setMachineUsageHistory] = useState<MachineUsageHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!workerCardId) return;

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const card = await client.getObject({
                    id: workerCardId,
                    options: { showContent: true },
                });

                if (card.data?.content && card.data.content.dataType === "moveObject") {
                    const fields = card.data.content.fields as SuiMoveObjectFields;
                    const machineHistory = Array.isArray(fields.machine_usage_history) ? (fields.machine_usage_history as MachineUsageHistoryItem[]) : [];
                    setMachineUsageHistory(machineHistory);
                }
            } catch (err) {
                console.error("Machine usage history fetch error:", err);
                setMachineUsageHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [workerCardId, client]);

    return { machineUsageHistory, loading };
}

/**
 * Worker's shift history hook (clock in/out)
 */
export function useWorkerShiftHistory(workerCardId?: string) {
    const client = useSuiClient();
    const [shiftHistory, setShiftHistory] = useState<ShiftHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!workerCardId) return;

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const card = await client.getObject({
                    id: workerCardId,
                    options: { showContent: true },
                });

                if (card.data?.content && card.data.content.dataType === "moveObject") {
                    const fields = card.data.content.fields as SuiMoveObjectFields;
                    const shiftHist = Array.isArray(fields.shift_history) ? (fields.shift_history as ShiftHistoryItem[]) : [];
                    setShiftHistory(shiftHist);
                }
            } catch (err) {
                console.error("Shift history fetch error:", err);
                setShiftHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [workerCardId, client]);

    return { shiftHistory, loading };
}

/**
 * Worker's award history hook
 */
export function useWorkerAwardHistory(workerCardId?: string) {
    const client = useSuiClient();
    const [awardHistory, setAwardHistory] = useState<AwardHistoryItem[]>([]);
    const [totalAwardPoints, setTotalAwardPoints] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!workerCardId) return;

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const card = await client.getObject({
                    id: workerCardId,
                    options: { showContent: true },
                });

                if (card.data?.content && card.data.content.dataType === "moveObject") {
                    const fields = card.data.content.fields as SuiMoveObjectFields;
                    const awardHist = Array.isArray(fields.award_history) ? (fields.award_history as AwardHistoryItem[]) : [];
                    setAwardHistory(awardHist);
                    setTotalAwardPoints(Number(fields.total_award_points) || 0);
                }
            } catch (err) {
                console.error("Award history fetch error:", err);
                setAwardHistory([]);
                setTotalAwardPoints(0);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [workerCardId, client]);

    return { awardHistory, totalAwardPoints, loading };
}

/**
 * System registry info hook
 */
export function useRegistryInfo() {
    const client = useSuiClient();
    const [registryInfo, setRegistryInfo] = useState<{ doorCounter: number; machineCounter: number }>({
        doorCounter: 0,
        machineCounter: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                setLoading(true);
                const registry = await client.getObject({
                    id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
                    options: { showContent: true },
                });

                if (registry.data?.content && registry.data.content.dataType === "moveObject") {
                    const fields = registry.data.content.fields as RegistryFields;
                    setRegistryInfo({
                        doorCounter: Number(fields.door_counter) || 0,
                        machineCounter: Number(fields.machine_counter) || 0,
                    });
                }
            } catch (err) {
                console.error("Registry info fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [client]);

    return { registryInfo, loading };
}

/**
 * Recent global door access hook (from registry)
 */
export function useRecentDoorAccess() {
    const client = useSuiClient();
    const [recentDoorAccess, setRecentDoorAccess] = useState<DoorAccessHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const registry = await client.getObject({
                    id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
                    options: { showContent: true },
                });

                if (registry.data?.content && registry.data.content.dataType === "moveObject") {
                    const fields = registry.data.content.fields as RegistryFields;
                    const recentDoors = (fields.recent_door_access as DoorAccessHistoryItem[]) || [];
                    setRecentDoorAccess(recentDoors);
                }
            } catch (err) {
                console.error("Recent door access fetch error:", err);
                setRecentDoorAccess([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Refresh every 15 seconds
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [client]);

    return { recentDoorAccess, loading };
}

/**
 * Recent global machine usage hook (from registry)
 */
export function useRecentMachineUsage() {
    const client = useSuiClient();
    const [recentMachineUsage, setRecentMachineUsage] = useState<MachineUsageHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const registry = await client.getObject({
                    id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
                    options: { showContent: true },
                });

                if (registry.data?.content && registry.data.content.dataType === "moveObject") {
                    const fields = registry.data.content.fields as RegistryFields;
                    const recentMachines = (fields.recent_machine_usage as MachineUsageHistoryItem[]) || [];
                    setRecentMachineUsage(recentMachines);
                }
            } catch (err) {
                console.error("Recent machine usage fetch error:", err);
                setRecentMachineUsage([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Refresh every 15 seconds
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [client]);

    return { recentMachineUsage, loading };
}

/**
 * Recent global shifts hook (from registry)
 */
export function useRecentShifts() {
    const client = useSuiClient();
    const [recentShifts, setRecentShifts] = useState<ShiftHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const registry = await client.getObject({
                    id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
                    options: { showContent: true },
                });

                if (registry.data?.content && registry.data.content.dataType === "moveObject") {
                    const fields = registry.data.content.fields as RegistryFields;
                    const recentShiftList = (fields.recent_shifts as ShiftHistoryItem[]) || [];
                    setRecentShifts(recentShiftList);
                }
            } catch (err) {
                console.error("Recent shifts fetch error:", err);
                setRecentShifts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Refresh every 10 seconds
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [client]);

    return { recentShifts, loading };
}

/**
 * Recent global awards hook (from registry)
 */
export function useRecentAwards() {
    const client = useSuiClient();
    const [recentAwards, setRecentAwards] = useState<AwardHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const registry = await client.getObject({
                    id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
                    options: { showContent: true },
                });

                if (registry.data?.content && registry.data.content.dataType === "moveObject") {
                    const fields = registry.data.content.fields as RegistryFields;
                    const recentAwardList = (fields.recent_awards as AwardHistoryItem[]) || [];
                    setRecentAwards(recentAwardList);
                }
            } catch (err) {
                console.error("Recent awards fetch error:", err);
                setRecentAwards([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Refresh every 15 seconds
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [client]);

    return { recentAwards, loading };
}

/**
 * All Worker Cards hook - fetches worker cards from current account + recent activity
 */
export function useAllWorkerCards() {
    const client = useSuiClient();
    const account = useCurrentAccount();
    const [workerCards, setWorkerCards] = useState<WorkerCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkerCards = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const workerAddresses = new Set<string>();

            // Add current user if they have account
            if (account?.address) {
                workerAddresses.add(account.address);
            }

            // Try to get addresses from different event types
            const eventTypes = ["WorkerCardIssuedEvent", "ClockEvent", "DoorAccessEvent", "MachineUsageEvent", "AwardEvent"];

            for (const eventType of eventTypes) {
                try {
                    const events = await client.queryEvents({
                        query: {
                            MoveEventType: `${CONTRACT_CONFIG.PACKAGE_ID}::identity::${eventType}`,
                        },
                        limit: 100,
                    });

                    events.data.forEach((event: any) => {
                        if (event.parsedJson?.worker_address) {
                            workerAddresses.add(event.parsedJson.worker_address);
                        }
                    });
                } catch (err) {
                    console.warn(`Failed to fetch ${eventType}:`, err);
                }
            }

            console.log(`Found ${workerAddresses.size} unique worker addresses`);

            // Fetch worker cards for each address
            const cardPromises = Array.from(workerAddresses).map(async (address) => {
                try {
                    const objects = await client.getOwnedObjects({
                        owner: address,
                        filter: {
                            StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::identity::WorkerCard`,
                        },
                        options: { showContent: true },
                    });

                    if (objects.data.length > 0 && objects.data[0].data?.content && objects.data[0].data.content.dataType === "moveObject") {
                        const cardFields = (objects.data[0].data.content as any).fields;
                        const decoder = new TextDecoder();

                        return {
                            id: objects.data[0].data.objectId,
                            worker_address: cardFields.worker_address || "",
                            card_number: cardFields.card_number ? decoder.decode(new Uint8Array(cardFields.card_number)) : "",
                            name: cardFields.name ? decoder.decode(new Uint8Array(cardFields.name)) : "",
                            department: cardFields.department ? decoder.decode(new Uint8Array(cardFields.department)) : "",
                            is_active: cardFields.is_active ?? false,
                            total_work_hours: Number(cardFields.total_work_hours || 0),
                            total_production: Number(cardFields.total_production || 0),
                            efficiency_score: Number(cardFields.efficiency_score || 0),
                            last_checkpoint_hash: cardFields.last_checkpoint_hash || [],
                            current_shift_start_ms: Number(cardFields.current_shift_start_ms || 0),
                            is_in_shift: Boolean(cardFields.is_in_shift),
                        } as WorkerCard;
                    }
                    return null;
                } catch (err) {
                    console.warn(`Error fetching worker card for ${address}:`, err);
                    return null;
                }
            });

            const cards = (await Promise.all(cardPromises)).filter((card): card is WorkerCard => card !== null);
            console.log(`Successfully fetched ${cards.length} worker cards`);
            setWorkerCards(cards);
        } catch (err) {
            console.error("Error fetching worker cards:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            setWorkerCards([]);
        } finally {
            setLoading(false);
        }
    }, [client, account?.address]);

    useEffect(() => {
        fetchWorkerCards();
        // Refresh every 30 seconds
        const interval = setInterval(fetchWorkerCards, 30000);
        return () => clearInterval(interval);
    }, [fetchWorkerCards]);

    return { workerCards, loading, error, refetch: fetchWorkerCards };
}

/**
 * Dashboard Statistics Hook - Get real-time statistics from the contract
 */
export function useDashboardStats() {
    const client = useSuiClient();
    const [stats, setStats] = useState({
        activeWorkersCount: 0,
        activeMachinesCount: 0,
        totalProduction: 0,
        todaysEntries: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const currentTime = Date.now();

            // Use multiGetObjects to get registry data
            const registry = await client.getObject({
                id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
                options: {
                    showContent: true,
                },
            });

            if (!registry.data?.content || registry.data.content.dataType !== "moveObject") {
                throw new Error("Failed to fetch registry");
            }

            const fields = registry.data.content.fields as any;

            // Get counters from registry
            const doorCounter = Number(fields.door_counter || 0);
            const machineCounter = Number(fields.machine_counter || 0);

            // Count active machines from doors and machines tables
            const doorsTableId = fields.doors?.fields?.id?.id;
            const machinesTableId = fields.machines?.fields?.id?.id;

            let activeMachines = 0;
            if (machinesTableId) {
                const machineFields = await client.getDynamicFields({
                    parentId: machinesTableId,
                });
                activeMachines = machineFields.data.length;
            }

            // Get recent machine usage for production count
            const recentMachineUsage = fields.recent_machine_usage || [];
            let totalProduction = 0;
            if (Array.isArray(recentMachineUsage)) {
                totalProduction = recentMachineUsage.reduce((sum: number, record: any) => {
                    return sum + Number(record.production_count || 0);
                }, 0);
            }

            // Get recent door access for today's entries
            const recentDoorAccess = fields.recent_door_access || [];
            let todaysEntries = 0;
            const dayInMs = 86400000;
            const cutoffTime = currentTime - dayInMs;

            if (Array.isArray(recentDoorAccess)) {
                todaysEntries = recentDoorAccess.filter((record: any) => {
                    const timestamp = Number(record.timestamp_ms || 0);
                    const accessType = Number(record.access_type || 0);
                    return timestamp >= cutoffTime && accessType === 2; // 2 = DOOR_ENTRY
                }).length;
            }

            setStats({
                activeWorkersCount: 0, // Will be calculated from worker cards
                activeMachinesCount: activeMachines,
                totalProduction: totalProduction,
                todaysEntries: todaysEntries,
            });
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [client]);

    useEffect(() => {
        fetchStats();
        // Refresh every 10 seconds for real-time updates
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}
