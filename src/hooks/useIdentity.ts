/**
 * Custom Hooks for Identity System
 * Blockchain ile etkileşim için React hooks
 */

import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import type { SuiObjectData } from '@mysten/sui/client'
import { useState, useEffect, useCallback } from 'react'
import { CONTRACT_CONFIG } from '../config/contracts'
import type { WorkerCard, Door, Machine } from '../types/identity'

/**
 * Worker Card hook - Kullanıcının worker card'ını getirir
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

        // Kullanıcının sahip olduğu objeleri getir
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
            
            // Byte array'leri string'e çevir
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
 * Admin Cap hook - Kullanıcının admin yetkisi olup olmadığını kontrol eder
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
 * Transaction hook - Transaction gönderme
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
 * Doors listesi hook
 */
export function useDoors() {
  const client = useSuiClient()
  const [doors, setDoors] = useState<Door[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        setLoading(true)
        // SystemRegistry'den kapıları çek
        const registry = await client.getObject({
          id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
          options: { showContent: true },
        })

        if (registry.data?.content && registry.data.content.dataType === 'moveObject') {
          const fields = registry.data.content.fields as any
          const doorsTable = fields.doors
          
          // Table'dan door'ları parse et (bu kısım indexer ile kolaylaştırılabilir)
          // Şimdilik boş döndürüyoruz, indexer entegrasyonu gerekli
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
 * Machines listesi hook
 */
export function useMachines() {
  const client = useSuiClient()
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true)
        // SystemRegistry'den makineleri çek
        const registry = await client.getObject({
          id: CONTRACT_CONFIG.SYSTEM_REGISTRY_ID,
          options: { showContent: true },
        })

        if (registry.data?.content && registry.data.content.dataType === 'moveObject') {
          const fields = registry.data.content.fields as any
          const machinesTable = fields.machines
          
          // Table'dan machine'leri parse et (indexer ile kolaylaştırılabilir)
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
 * Events hook - Blockchain event'lerini dinle
 */
export function useIdentityEvents(eventType?: string) {
  const client = useSuiClient()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        
        // Event'leri query et
        const eventQuery = await client.queryEvents({
          query: {
            MoveEventType: eventType 
              ? `${CONTRACT_CONFIG.PACKAGE_ID}::identity::${eventType}`
              : `${CONTRACT_CONFIG.PACKAGE_ID}::identity`,
          },
          limit: 50,
          order: 'descending',
        })

        setEvents(eventQuery.data)
      } catch (err) {
        console.error('Events getirme hatası:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
    
    // Her 10 saniyede bir güncelle
    const interval = setInterval(fetchEvents, 10000)
    return () => clearInterval(interval)
  }, [client, eventType])

  return { events, loading }
}
