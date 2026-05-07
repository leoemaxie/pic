import { db } from './firebase'
import admin from 'firebase-admin'

export async function aggregateMarketIntelligence() {
  const sevenDaysAgo = admin.firestore.Timestamp.fromDate(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  )

  const logsSnap = await db.collection('purchaseLogs')
    .where('timestamp', '>=', sevenDaysAgo)
    .get()

  const logs = logsSnap.docs.map(d => d.data())

  const groups: Record<string, typeof logs> = {}
  for (const log of logs) {
    const key = `${log.product}:${log.location}`
    if (!groups[key]) groups[key] = []
    groups[key].push(log)
  }

  for (const [key, groupLogs] of Object.entries(groups)) {
    const [product, location] = key.split(':')
    const prices = groupLogs.map(l => l.pricePerUnit as number).filter(p => p > 0).sort((a, b) => a - b)

    if (prices.length === 0) continue

    const priceMin = prices[0]
    const priceMax = prices[prices.length - 1]
    const priceMean = prices.reduce((a, b) => a + b, 0) / prices.length
    const priceMedian = prices[Math.floor(prices.length / 2)]
    const variance = prices.reduce((acc, p) => acc + Math.pow(p - priceMean, 2), 0) / prices.length
    const volatility = Math.sqrt(variance)

    const fourteenDaysAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    )

    const prevSnap = await db.collection('purchaseLogs')
      .where('product', '==', product)
      .where('location', '==', location)
      .where('timestamp', '>=', fourteenDaysAgo)
      .where('timestamp', '<', sevenDaysAgo)
      .get()

    const prevLogs = prevSnap.docs.map(d => d.data())

    let trend = 'stable'
    if (prevLogs.length > 0) {
      const prevMean = prevLogs.reduce((acc, l) => acc + (l.pricePerUnit as number), 0) / prevLogs.length
      if (priceMean > prevMean * 1.05) trend = 'rising'
      else if (priceMean < prevMean * 0.95) trend = 'falling'
    }

    const docId = `${product}:${location}`.replace(/[^a-zA-Z0-9]/g, '-')
    await db.collection('marketIntelligence').doc(docId).set({
      id: docId,
      product,
      location,
      priceMin,
      priceMax,
      priceMedian,
      priceMean,
      buyerCount: groupLogs.length,
      trend,
      volatility,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
  }
}

export async function generateBriefingForUser(userId: string, location: string, purchasedProducts: string[]) {
  const products = purchasedProducts.length > 0 ? purchasedProducts : ['rice', 'beans', 'oil']

  const insightsSnap = await db.collection('marketIntelligence')
    .where('product', 'in', products)
    .limit(10)
    .get()

  const insights = insightsSnap.docs.map(d => d.data())

  const alerts = insights.slice(0, 5).map(i => ({
    product: i.product,
    location: i.location,
    priceRange: `₦${(i.priceMin as number).toLocaleString()}–₦${(i.priceMax as number).toLocaleString()}`,
    trend: i.trend,
    buyerCount: i.buyerCount,
    message: i.trend === 'rising'
      ? `${i.product} prices are rising in ${i.location}. Stock up now.`
      : i.trend === 'falling'
      ? `${i.product} prices are falling. Wait before restocking.`
      : `${i.product} prices are stable at ₦${Math.round(i.priceMean as number).toLocaleString()}/unit`,
  }))

  return {
    alerts,
    generatedAt: new Date().toISOString(),
  }
}
