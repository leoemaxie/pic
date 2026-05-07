import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { verifyToken } from '@/lib/auth'
import { parseMessage } from '@/lib/nlp'
import admin from 'firebase-admin'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userDoc = await db.collection('users').doc(payload.userId).get()
  if (!userDoc.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const user = userDoc.data()!

  const { message } = await req.json()
  const parsed = parseMessage(message)

  const logRef = db.collection('purchaseLogs').doc()
  const logData = {
    id: logRef.id,
    userId: user.id,
    rawMessage: message,
    product: parsed.product,
    quantity: parsed.quantity,
    quantityUnit: parsed.quantityUnit,
    pricePerUnit: parsed.pricePerUnit,
    totalPrice: parsed.totalPrice,
    supplier: parsed.supplier ?? null,
    supplierType: parsed.supplierType,
    location: user.location,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    synced: true,
    confidenceScore: parsed.confidence,
  }
  await logRef.set(logData)

  const marketSnap = await db.collection('marketIntelligence')
    .where('product', '==', parsed.product)
    .limit(1)
    .get()

  let marketInsightText = ''
  if (!marketSnap.empty && parsed.pricePerUnit > 0) {
    const marketInsight = marketSnap.docs[0].data()
    if (parsed.pricePerUnit < marketInsight.priceMean * 0.95) {
      marketInsightText = `💚 Great deal! Others pay ₦${Math.round(marketInsight.priceMean).toLocaleString()} on average.`
    } else if (parsed.pricePerUnit > marketInsight.priceMean * 1.05) {
      marketInsightText = `⚠️ You paid slightly above market average (₦${Math.round(marketInsight.priceMean).toLocaleString()}).`
    } else {
      marketInsightText = `✓ Fair market price. Range: ₦${marketInsight.priceMin.toLocaleString()}–₦${marketInsight.priceMax.toLocaleString()}`
    }
  }

  return NextResponse.json({ log: logData, parsed, marketInsight: marketInsightText })
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('pic-token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const snap = await db.collection('purchaseLogs')
    .where('userId', '==', payload.userId)
    .orderBy('timestamp', 'desc')
    .limit(50)
    .get()

  const logs = snap.docs.map(d => d.data())
  return NextResponse.json(logs)
}
