import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { verifyToken } from '@/lib/auth'
import admin from 'firebase-admin'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const field = payload.role === 'retailer' ? 'retailerId' : 'wholesalerId'
  const snap = await db.collection('messageThreads')
    .where(field, '==', payload.userId)
    .orderBy('lastMessageAt', 'desc')
    .get()

  const threads = await Promise.all(snap.docs.map(async d => {
    const thread = d.data()
    const [retailerDoc, wholesalerDoc, messagesSnap] = await Promise.all([
      db.collection('users').doc(thread.retailerId).get(),
      db.collection('users').doc(thread.wholesalerId).get(),
      db.collection('messages').where('threadId', '==', thread.id).orderBy('timestamp', 'desc').limit(1).get(),
    ])
    return {
      ...thread,
      retailer: retailerDoc.exists ? { shopName: retailerDoc.data()!.shopName } : null,
      wholesaler: wholesalerDoc.exists ? { shopName: wholesalerDoc.data()!.shopName } : null,
      messages: messagesSnap.docs.map(m => m.data()),
    }
  }))

  return NextResponse.json(threads)
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { wholesalerId, product, text } = await req.json()

  const existingSnap = await db.collection('messageThreads')
    .where('retailerId', '==', payload.userId)
    .where('wholesalerId', '==', wholesalerId)
    .where('product', '==', product)
    .limit(1)
    .get()

  let threadId: string
  let thread: admin.firestore.DocumentData

  if (!existingSnap.empty) {
    threadId = existingSnap.docs[0].id
    thread = existingSnap.docs[0].data()
  } else {
    const threadRef = db.collection('messageThreads').doc()
    thread = {
      id: threadRef.id,
      retailerId: payload.userId,
      wholesalerId,
      product,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'open',
    }
    await threadRef.set(thread)
    threadId = threadRef.id
  }

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

  return NextResponse.json({ thread, message }, { status: 201 })
}
