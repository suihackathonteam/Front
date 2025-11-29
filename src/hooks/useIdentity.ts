/**
 * Custom Hooks for the Identity System
 * React hooks for interacting with the blockchain
 */

import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import type { SuiObjectData } from '@mysten/sui/client'
import { useState, useEffect, useCallback } from 'react'
import { CONTRACT_CONFIG } from '../config/contracts'
import type { WorkerCard, Door, Machine } from '../types/identity'

/**
 * Worker Card hook - retrieves the user's worker card
 */
export function useWorkerCard() {
  const account = useCurrentAccount()
  const client = useSuiClient()
  const [workerCard, setWorkerCard] = useState<WorkerCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!account?.address) {
      setWorkerCard(null)
      setLoading(false)
      return
    }

    const fetchWorkerCard = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch objects owned by the user
        const objects = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::identity::WorkerCard`,
          },
          options: {
            showContent: true,
          },
        })

        if (objects.data.length > 0) {
          const cardData = objects.data[0].data as SuiObjectData
          if (cardData.content && cardData.content.dataType === 'moveObject') {
            const fields = cardData.content.fields as any
            
            // Convert byte arrays to strings
            const decoder = new TextDecoder()
            
            setWorkerCard({
              id: cardData.objectId,
              worker_address: fields.worker_address,
              card_number: decoder.decode(new Uint8Array(fields.card_number)),
              name: decoder.decode(new Uint8Array(fields.name)),
              department: decoder.decode(new Uint8Array(fields.department)),
              is_active: fields.is_active,
              total_work_hours: Number(fields.total_work_hours),
              total_production: Number(fields.total_production),
              efficiency_score: Number(fields.efficiency_score),
              last_checkpoint_hash: fields.last_checkpoint_hash,
            })
          }
        } else {
          setWorkerCard(null)
        }
      } catch (err) {
        console.error('Worker card getirme hatası:', err)
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkerCard()
  }, [account?.address, client])

  return { workerCard, loading, error, refetch: () => {} }
}

/**
 * Admin Cap hook - checks whether the user has admin privileges
 */
export function useAdminCap() {
  const account = useCurrentAccount()
  const client = useSuiClient()
  const [adminCapId, setAdminCapId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!account?.address) {
      setIsAdmin(false)
      setAdminCapId(null)
      setLoading(false)
      return
    }

    const checkAdmin = async () => {
      try {
        setLoading(true)

        const objects = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: `${CONTRACT_CONFIG.PACKAGE_ID}::identity::AdminCap`,
          },
        })

        if (objects.data.length > 0) {
          setIsAdmin(true)
          setAdminCapId(objects.data[0].data?.objectId || null)
        } else {
          setIsAdmin(false)
          setAdminCapId(null)
        }
      } catch (err) {
        console.error('Admin kontrol hatası:', err)
        setIsAdmin(false)
        setAdminCapId(null)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [account?.address, client])

  return { isAdmin, adminCapId, loading }
}

/**
 * Transaction hook - sending transactions
 */
export function useIdentityTransaction() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeTransaction = useCallback(
    async (tx: any, options?: { onSuccess?: () => void; onError?: (error: string) => void }) => {
      setIsLoading(true)
      setError(null)

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            setIsLoading(false)
            options?.onSuccess?.()
          },
          onError: (err) => {
            const errorMsg = err instanceof Error ? err.message : 'Transaction başarısız'
            setError(errorMsg)
            setIsLoading(false)
            options?.onError?.(errorMsg)
          },
        }
      )
    },
    [signAndExecute]
  )

  return { executeTransaction, isLoading, error }
}

/**
 * Doors list hook
 */
export function useDoors() {
  const client = useSuiClient()
  const [doors, setDoors] = useState<Door[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        setLoading(true)
        // Fetch doors from the SystemRegistry
        const registry = await client.getObject({
          id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
          options: { showContent: true },
        })

        if (registry.data?.content && registry.data.content.dataType === 'moveObject') {
          // Parse doors from the table (this can be simplified using an indexer)
          // For now return an empty array; indexer integration is required
          setDoors([])
        }
      } catch (err) {
        console.error('Doors getirme hatası:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDoors()
  }, [client])

  return { doors, loading }
}

/**
 * Machines list hook
 */
export function useMachines() {
  const client = useSuiClient()
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true)
        // Fetch machines from the SystemRegistry
        const registry = await client.getObject({
          id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
          options: { showContent: true },
        })

        if (registry.data?.content && registry.data.content.dataType === 'moveObject') {
          // Parse machines from the table (can be simplified with an indexer)
          setMachines([])
        }
      } catch (err) {
        console.error('Machines getirme hatası:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMachines()
  }, [client])

  return { machines, loading }
}

/**
 * Events hook - listen to blockchain events
 */
export function useIdentityEvents(eventType?: string) {
  const client = useSuiClient()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        
        if (eventType) {
          // Query specific event type
          const eventQuery = await client.queryEvents({
            query: {
              MoveEventType: `${CONTRACT_CONFIG.PACKAGE_ID}::identity::${eventType}`
            },
            limit: 50,
            order: 'descending',
          })
          setEvents(eventQuery.data)
        } else {
          // Query all event types
          const eventTypes = ['DoorAccessEvent', 'MachineUsageEvent', 'ClockEvent', 'AwardEvent']
          const allEvents: any[] = []
          
          for (const type of eventTypes) {
            try {
              const eventQuery = await client.queryEvents({
                query: {
                  MoveEventType: `${CONTRACT_CONFIG.PACKAGE_ID}::identity::${type}`
                },
                limit: 50,
                order: 'descending',
              })
              allEvents.push(...eventQuery.data)
            } catch (err) {
              console.warn(`${type} event fetch error:`, err)
            }
          }
          
          // Sort by timestamp descending
          allEvents.sort((a, b) => Number(b.timestampMs) - Number(a.timestampMs))
          setEvents(allEvents)
        }
      } catch (err) {
        console.error('Events getirme hatası:', err)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchEvents, 10000)
    return () => clearInterval(interval)
  }, [client, eventType])

  return { events, loading }
}
