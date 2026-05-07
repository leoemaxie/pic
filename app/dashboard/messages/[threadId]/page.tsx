import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import MessagesClient from './MessagesClient'
import { db } from '@/lib/firebase'

function toISOString(val: unknown): string {
  if (!val) return new Date().toISOString()
  if (typeof val === 'string') return val
  if (val && typeof (val as { toDate?: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate().toISOString()
  }
  return new Date().toISOString()
}

export default async function MessagesPage({ params }: { params: Promise<{ threadId: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('pic-token')?.value
  if (!token) redirect('/login')

  const payload = verifyToken(token)
  if (!payload) redirect('/login')

  const { threadId } = await params

  const [threadDoc, messagesSnap] = await Promise.all([
    db.collection('messageThreads').doc(threadId).get(),
    db.collection('messages').where('threadId', '==', threadId).orderBy('timestamp', 'asc').get(),
  ])

  if (!threadDoc.exists) redirect('/dashboard/retailer')
  const threadData = threadDoc.data()!

  const [retailerDoc, wholesalerDoc] = await Promise.all([
    db.collection('users').doc(threadData.retailerId).get(),
    db.collection('users').doc(threadData.wholesalerId).get(),
  ])

  return (
    <MessagesClient
      thread={{
        id: threadId,
        product: threadData.product,
        retailerName: retailerDoc.exists ? retailerDoc.data()!.shopName : 'Retailer',
        wholesalerName: wholesalerDoc.exists ? wholesalerDoc.data()!.shopName : 'Wholesaler',
      }}
      initialMessages={messagesSnap.docs.map(m => ({
        id: m.data().id,
        senderId: m.data().senderId,
        text: m.data().text,
        timestamp: toISOString(m.data().timestamp),
        read: m.data().read,
      }))}
      userId={payload.userId}
    />
  )
}
