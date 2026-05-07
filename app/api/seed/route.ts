import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import admin from 'firebase-admin'

const SEED_DATA = [
  { product: 'rice', location: 'Lagos', priceMin: 7800, priceMax: 9200, priceMean: 8500, trend: 'stable', buyerCount: 45 },
  { product: 'rice', location: 'Kano', priceMin: 7200, priceMax: 8400, priceMean: 7800, trend: 'falling', buyerCount: 32 },
  { product: 'rice', location: 'Abuja', priceMin: 8200, priceMax: 9800, priceMean: 9000, trend: 'rising', buyerCount: 28 },
  { product: 'beans', location: 'Lagos', priceMin: 3500, priceMax: 4800, priceMean: 4200, trend: 'stable', buyerCount: 38 },
  { product: 'oil', location: 'Lagos', priceMin: 2800, priceMax: 3800, priceMean: 3200, trend: 'rising', buyerCount: 52 },
  { product: 'flour', location: 'Lagos', priceMin: 1800, priceMax: 2400, priceMean: 2100, trend: 'stable', buyerCount: 25 },
  { product: 'sugar', location: 'Lagos', priceMin: 1200, priceMax: 1800, priceMean: 1500, trend: 'stable', buyerCount: 30 },
  { product: 'tomatoes', location: 'Lagos', priceMin: 800, priceMax: 1600, priceMean: 1200, trend: 'rising', buyerCount: 41 },
  { product: 'garri', location: 'Lagos', priceMin: 900, priceMax: 1400, priceMean: 1100, trend: 'falling', buyerCount: 20 },
  { product: 'noodles', location: 'Lagos', priceMin: 3800, priceMax: 5200, priceMean: 4500, trend: 'stable', buyerCount: 35 },
]

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const batch = db.collection('marketIntelligence').firestore.batch()

  for (const item of SEED_DATA) {
    const docId = `${item.product}-${item.location}`.toLowerCase()
    const ref = db.collection('marketIntelligence').doc(docId)
    batch.set(ref, {
      id: docId,
      product: item.product,
      location: item.location,
      priceMin: item.priceMin,
      priceMax: item.priceMax,
      priceMedian: item.priceMean,
      priceMean: item.priceMean,
      buyerCount: item.buyerCount,
      trend: item.trend,
      volatility: (item.priceMax - item.priceMin) / 4,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
  }

  await batch.commit()

  return NextResponse.json({ seeded: SEED_DATA.length })
}
