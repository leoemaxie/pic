const DB_NAME = 'pic-offline'
const DB_VERSION = 1
const STORE_PURCHASES = 'pendingPurchases'

export interface PendingPurchase {
  id: string
  message: string
  timestamp: string
  synced: boolean
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_PURCHASES)) {
        const store = db.createObjectStore(STORE_PURCHASES, { keyPath: 'id' })
        store.createIndex('synced', 'synced', { unique: false })
      }
    }
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result)
    req.onerror = () => reject(req.error)
  })
}

export async function savePendingPurchase(purchase: PendingPurchase): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PURCHASES, 'readwrite')
    tx.objectStore(STORE_PURCHASES).put(purchase)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getPendingPurchases(): Promise<PendingPurchase[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PURCHASES, 'readonly')
    const req = tx.objectStore(STORE_PURCHASES).index('synced').getAll(IDBKeyRange.only(0))
    req.onsuccess = () => resolve(req.result as PendingPurchase[])
    req.onerror = () => reject(req.error)
  })
}

export async function markPurchaseSynced(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PURCHASES, 'readwrite')
    const store = tx.objectStore(STORE_PURCHASES)
    const getReq = store.get(id)
    getReq.onsuccess = () => {
      const record = getReq.result as PendingPurchase | undefined
      if (record) store.put({ ...record, synced: true })
      resolve()
    }
    getReq.onerror = () => reject(getReq.error)
  })
}

export async function syncPendingPurchases(
  onSync: (purchase: PendingPurchase) => Promise<void>
): Promise<number> {
  const pending = await getPendingPurchases()
  let synced = 0
  for (const purchase of pending) {
    try {
      await onSync(purchase)
      await markPurchaseSynced(purchase.id)
      synced++
    } catch {
      // keep it pending
    }
  }
  return synced
}
