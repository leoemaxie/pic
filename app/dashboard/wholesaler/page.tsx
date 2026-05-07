import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { redirect } from 'next/navigation'
import admin from 'firebase-admin'
import WholesalerDashboardClient from './WholesalerDashboardClient'

function toISOString(val: unknown): string {
  if (!val) return new Date().toISOString()
  if (typeof val === 'string') return val
  if (val && typeof (val as { toDate?: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate().toISOString()
  }
  return new Date().toISOString()
}

function sevenDaysAgoTimestamp() {
  return admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
}

export default async function WholesalerDashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get('pic-token')?.value
  if (!token) redirect('/login')

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'wholesaler') redirect('/login')

  const userDoc = await db.collection('users').doc(payload.userId).get()
  if (!userDoc.exists) redirect('/login')
  const user = userDoc.data()!

  const pricesSnap = await db.collection('wholesalerPrices')
    .where('wholesalerId', '==', user.id)
    .orderBy('lastUpdated', 'desc')
    .get()
  type PriceRecord = { product?: string; lastUpdated: string; [key: string]: unknown }
  const prices: PriceRecord[] = pricesSnap.docs.map(d => {
    const data = d.data() as Record<string, unknown>
    return { ...data, lastUpdated: toISOString(data.lastUpdated) }
  })

  const productList = prices.map(p => p.product ?? '').filter(Boolean) as string[]
  const sevenDaysAgo = sevenDaysAgoTimestamp()

  let logsSnap
  if (productList.length > 0) {
    logsSnap = await db.collection('purchaseLogs')
      .where('timestamp', '>=', sevenDaysAgo)
      .where('product', 'in', productList.slice(0, 30))
      .get()
  } else {
    logsSnap = await db.collection('purchaseLogs')
      .where('timestamp', '>=', sevenDaysAgo)
      .limit(100)
      .get()
  }

  const groups: Record<string, { count: number; totalPrice: number }> = {}
  for (const doc of logsSnap.docs) {
    const data = doc.data()
    if (!groups[data.product]) groups[data.product] = { count: 0, totalPrice: 0 }
    groups[data.product].count++
    groups[data.product].totalPrice += (data.pricePerUnit as number) || 0
  }
  const demandSignals = Object.entries(groups)
    .map(([product, { count, totalPrice }]) => ({ product, buyerCount: count, avgPrice: totalPrice / count }))
    .sort((a, b) => b.buyerCount - a.buyerCount)

  const threadsSnap = await db.collection('messageThreads')
    .where('wholesalerId', '==', user.id)
    .orderBy('lastMessageAt', 'desc')
    .get()

  const threads = await Promise.all(threadsSnap.docs.map(async d => {
    const thread = d.data()
    const [retailerDoc, lastMsgSnap] = await Promise.all([
      db.collection('users').doc(thread.retailerId).get(),
      db.collection('messages').where('threadId', '==', thread.id).orderBy('timestamp', 'desc').limit(1).get(),
    ])
    return {
      id: thread.id,
      retailerName: retailerDoc.exists ? (retailerDoc.data()!.shopName as string) : 'Unknown',
      product: thread.product as string,
      lastMessage: lastMsgSnap.empty ? '' : (lastMsgSnap.docs[0].data().text as string),
      lastMessageAt: toISOString(thread.lastMessageAt),
    }
  }))

  return (
    <WholesalerDashboardClient
      user={{ id: user.id, shopName: user.shopName, location: user.location }}
      prices={prices as unknown as Parameters<typeof WholesalerDashboardClient>[0]['prices']}
      demandSignals={demandSignals}
      threads={threads}
    />
  )
}
