import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const product = searchParams.get('product')

  const prices = await prisma.wholesalerPrice.findMany({
    where: {
      ...(product ? { product: { contains: product } } : {}),
      lastUpdated: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    include: { wholesaler: { select: { id: true, shopName: true, location: true, phone: true } } },
    orderBy: { pricePerUnit: 'asc' },
    take: 20,
  })

  return NextResponse.json(prices)
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'wholesaler') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { product, pricePerUnit, quantityUnit, availableQuantity, notes } = await req.json()
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const price = await prisma.wholesalerPrice.create({
    data: {
      wholesalerId: user.id,
      product,
      pricePerUnit,
      quantityUnit,
      availableQuantity,
      location: user.location,
      notes,
    },
  })

  return NextResponse.json(price, { status: 201 })
}
