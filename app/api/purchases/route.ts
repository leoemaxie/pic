import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { parseMessage } from '@/lib/nlp'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { message } = await req.json()
  const parsed = parseMessage(message)

  const log = await prisma.purchaseLog.create({
    data: {
      userId: user.id,
      rawMessage: message,
      product: parsed.product,
      quantity: parsed.quantity,
      quantityUnit: parsed.quantityUnit,
      pricePerUnit: parsed.pricePerUnit,
      totalPrice: parsed.totalPrice,
      supplier: parsed.supplier,
      supplierType: parsed.supplierType,
      location: user.location,
      confidenceScore: parsed.confidence,
    },
  })

  const marketInsight = await prisma.marketIntelligence.findFirst({
    where: { product: parsed.product },
  })

  let marketInsightText = ''
  if (marketInsight && parsed.pricePerUnit > 0) {
    if (parsed.pricePerUnit < marketInsight.priceMean * 0.95) {
      marketInsightText = `💚 Great deal! Others pay ₦${Math.round(marketInsight.priceMean).toLocaleString()} on average.`
    } else if (parsed.pricePerUnit > marketInsight.priceMean * 1.05) {
      marketInsightText = `⚠️ You paid slightly above market average (₦${Math.round(marketInsight.priceMean).toLocaleString()}).`
    } else {
      marketInsightText = `✓ Fair market price. Range: ₦${marketInsight.priceMin.toLocaleString()}–₦${marketInsight.priceMax.toLocaleString()}`
    }
  }

  return NextResponse.json({ log, parsed, marketInsight: marketInsightText })
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const logs = await prisma.purchaseLog.findMany({
    where: { userId: payload.userId },
    orderBy: { timestamp: 'desc' },
    take: 50,
  })
  return NextResponse.json(logs)
}
