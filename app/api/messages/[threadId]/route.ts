import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { verifyToken } from '@/lib/auth'
import admin from 'firebase-admin'

export async function GET(req: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { threadId } = await params

  const messagesSnap = await db.collection('messages')
    .where('threadId', '==', threadId)
    .orderBy('timestamp', 'asc')
    .get()

  const messages = messagesSnap.docs.map(d => d.data())

  const unreadDocs = messagesSnap.docs.filter(d => {
    const data = d.data()
    return data.senderId !== payload.userId && !data.read
  })

  await Promise.all(
    unreadDocs.map(d => d.ref.update({ read: true }))
  )

  return NextResponse.json(messages)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { threadId } = await params
  const { text } = await req.json()

  const msgRef = db.collection('messages').doc()
  const message = {
    id: msgRef.id,
    threadId,
    senderId: payload.userId,
    text,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    read: false,
  }
  await msgRef.set(message)

  await db.collection('messageThreads').doc(threadId).update({
    lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  return NextResponse.json(message, { status: 201 })
}
