import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { verifyToken } from '@/lib/auth'
import admin from 'firebase-admin'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const product = searchParams.get('product')

  const sevenDaysAgo = admin.firestore.Timestamp.fromDate(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  )

  let query = db.collection('wholesalerPrices')
    .where('lastUpdated', '>=', sevenDaysAgo)
    .orderBy('lastUpdated', 'desc') as admin.firestore.Query

  if (product) {
    query = db.collection('wholesalerPrices')
      .where('product', '==', product)
      .where('lastUpdated', '>=', sevenDaysAgo)
  }

  const snap = await query.limit(20).get()

  const prices = await Promise.all(snap.docs.map(async d => {
    const price = d.data()
    const wholesalerDoc = await db.collection('users').doc(price.wholesalerId).get()
    const wholesaler = wholesalerDoc.exists
      ? { id: wholesalerDoc.id, shopName: wholesalerDoc.data()!.shopName, location: wholesalerDoc.data()!.location, phone: wholesalerDoc.data()!.phone }
      : null
    return { ...price, wholesaler }
  }))

  return NextResponse.json(prices)
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'wholesaler') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const userDoc = await db.collection('users').doc(payload.userId).get()
  if (!userDoc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const user = userDoc.data()!

  const { product, pricePerUnit, quantityUnit, availableQuantity, notes } = await req.json()

  const priceRef = db.collection('wholesalerPrices').doc()
  const priceData = {
    id: priceRef.id,
    wholesalerId: user.id,
    product,
    pricePerUnit,
    quantityUnit,
    availableQuantity,
    location: user.location,
    notes: notes ?? null,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  }
  await priceRef.set(priceData)

  return NextResponse.json(priceData, { status: 201 })
}
