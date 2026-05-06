import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const threads = await prisma.messageThread.findMany({
    where: payload.role === 'retailer'
      ? { retailerId: payload.userId }
      : { wholesalerId: payload.userId },
    include: {
      retailer: { select: { shopName: true } },
      wholesaler: { select: { shopName: true } },
      messages: { orderBy: { timestamp: 'desc' }, take: 1 },
    },
    orderBy: { lastMessageAt: 'desc' },
  })

  return NextResponse.json(threads)
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { wholesalerId, product, text } = await req.json()

  let thread = await prisma.messageThread.findFirst({
    where: { retailerId: payload.userId, wholesalerId, product },
  })

  if (!thread) {
    thread = await prisma.messageThread.create({
      data: { retailerId: payload.userId, wholesalerId, product },
    })
  }

  const message = await prisma.message.create({
    data: { threadId: thread.id, senderId: payload.userId, text },
  })

  await prisma.messageThread.update({
    where: { id: thread.id },
    data: { lastMessageAt: new Date() },
  })

  return NextResponse.json({ thread, message }, { status: 201 })
}
