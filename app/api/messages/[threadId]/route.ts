import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { threadId } = await params
  const messages = await prisma.message.findMany({
    where: { threadId },
    orderBy: { timestamp: 'asc' },
  })

  await prisma.message.updateMany({
    where: { threadId, senderId: { not: payload.userId }, read: false },
    data: { read: true },
  })

  return NextResponse.json(messages)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { threadId } = await params
  const { text } = await req.json()

  const message = await prisma.message.create({
    data: { threadId, senderId: payload.userId, text },
  })

  await prisma.messageThread.update({
    where: { id: threadId },
    data: { lastMessageAt: new Date() },
  })

  return NextResponse.json(message, { status: 201 })
}
