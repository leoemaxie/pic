import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { redirect } from 'next/navigation'
import RetailerDashboardClient from './RetailerDashboardClient'

function toISOString(val: unknown): string {
  if (!val) return new Date().toISOString()
  if (typeof val === 'string') return val
  if (val && typeof (val as { toDate?: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate().toISOString()
  }
  return new Date().toISOString()
}

export default async function RetailerDashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get('pic-token')?.value
  if (!token) redirect('/login')

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'retailer') redirect('/login')

  const userDoc = await db.collection('users').doc(payload.userId).get()
  if (!userDoc.exists) redirect('/login')
  const user = userDoc.data()!

  const [logsSnap, briefingSnap] = await Promise.all([
    db.collection('purchaseLogs')
      .where('userId', '==', user.id)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get(),
    db.collection('briefings')
      .where('userId', '==', user.id)
      .where('delivered', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get(),
  ])

  type LogRecord = { product?: string; timestamp: string; [key: string]: unknown }
  const recentLogs: LogRecord[] = logsSnap.docs.map(d => {
    const data = d.data() as Record<string, unknown>
    return { ...data, timestamp: toISOString(data.timestamp) }
  })
  const briefingDoc = briefingSnap.empty ? null : briefingSnap.docs[0]

  const products = [...new Set(recentLogs.map(l => l.product ?? ''))].filter(Boolean) as string[]
  const marketSnap = products.length > 0
    ? await db.collection('marketIntelligence').where('product', 'in', products.slice(0, 10)).limit(10).get()
    : await db.collection('marketIntelligence').limit(10).get()
  const marketData = marketSnap.docs.map(d => d.data())

  if (briefingDoc) {
    await briefingDoc.ref.update({ delivered: true })
  }

  return (
    <RetailerDashboardClient
      user={{ id: user.id, shopName: user.shopName, location: user.location, role: user.role }}
      recentLogs={recentLogs as unknown as Parameters<typeof RetailerDashboardClient>[0]['recentLogs']}
      briefing={briefingDoc ? JSON.parse(briefingDoc.data().content) : null}
      marketData={marketData as Parameters<typeof RetailerDashboardClient>[0]['marketData']}
    />
  )
}
