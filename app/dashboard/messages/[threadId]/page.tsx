import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import MessagesClient from './MessagesClient'
import { prisma } from '@/lib/db'

export default async function MessagesPage({ params }: { params: Promise<{ threadId: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('pic-token')?.value
  if (!token) redirect('/login')

  const payload = verifyToken(token)
  if (!payload) redirect('/login')

  const { threadId } = await params

  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    include: {
      retailer: { select: { shopName: true } },
      wholesaler: { select: { shopName: true } },
      messages: { orderBy: { timestamp: 'asc' } },
    },
  })

  if (!thread) redirect('/dashboard/retailer')

  return (
    <MessagesClient
      thread={{
        id: thread.id,
        product: thread.product,
        retailerName: thread.retailer.shopName,
        wholesalerName: thread.wholesaler.shopName,
      }}
      initialMessages={thread.messages.map(m => ({
        id: m.id,
        senderId: m.senderId,
        text: m.text,
        timestamp: m.timestamp.toISOString(),
        read: m.read,
      }))}
      userId={payload.userId}
    />
  )
}
