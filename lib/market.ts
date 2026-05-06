import { prisma } from './db'

export async function aggregateMarketIntelligence() {
  const logs = await prisma.purchaseLog.findMany({
    where: {
      timestamp: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  })

  const groups: Record<string, typeof logs> = {}
  for (const log of logs) {
    const key = `${log.product}:${log.location}`
    if (!groups[key]) groups[key] = []
    groups[key].push(log)
  }

  for (const [key, groupLogs] of Object.entries(groups)) {
    const [product, location] = key.split(':')
    const prices = groupLogs.map(l => l.pricePerUnit).filter(p => p > 0).sort((a, b) => a - b)

    if (prices.length === 0) continue

    const priceMin = prices[0]
    const priceMax = prices[prices.length - 1]
    const priceMean = prices.reduce((a, b) => a + b, 0) / prices.length
    const priceMedian = prices[Math.floor(prices.length / 2)]
    const variance = prices.reduce((acc, p) => acc + Math.pow(p - priceMean, 2), 0) / prices.length
    const volatility = Math.sqrt(variance)

    const prevLogs = await prisma.purchaseLog.findMany({
      where: {
        product,
        location,
        timestamp: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    })

    let trend = 'stable'
    if (prevLogs.length > 0) {
      const prevMean = prevLogs.reduce((acc, l) => acc + l.pricePerUnit, 0) / prevLogs.length
      if (priceMean > prevMean * 1.05) trend = 'rising'
      else if (priceMean < prevMean * 0.95) trend = 'falling'
    }

    await prisma.marketIntelligence.upsert({
      where: {
        id: `${product}:${location}`.replace(/[^a-zA-Z0-9]/g, '-'),
      },
      create: {
        id: `${product}:${location}`.replace(/[^a-zA-Z0-9]/g, '-'),
        product,
        location,
        priceMin,
        priceMax,
        priceMedian,
        priceMean,
        buyerCount: groupLogs.length,
        trend,
        volatility,
      },
      update: {
        priceMin,
        priceMax,
        priceMedian,
        priceMean,
        buyerCount: groupLogs.length,
        trend,
        volatility,
        lastUpdated: new Date(),
      },
    })
  }
}

export async function generateBriefingForUser(userId: string, location: string, purchasedProducts: string[]) {
  const insights = await prisma.marketIntelligence.findMany({
    where: {
      product: { in: purchasedProducts.length > 0 ? purchasedProducts : ['rice', 'beans', 'oil'] },
    },
    orderBy: { lastUpdated: 'desc' },
    take: 10,
  })

  const alerts = insights.slice(0, 5).map(i => ({
    product: i.product,
    location: i.location,
    priceRange: `₦${i.priceMin.toLocaleString()}–₦${i.priceMax.toLocaleString()}`,
    trend: i.trend,
    buyerCount: i.buyerCount,
    message: i.trend === 'rising'
      ? `${i.product} prices are rising in ${i.location}. Stock up now.`
      : i.trend === 'falling'
      ? `${i.product} prices are falling. Wait before restocking.`
      : `${i.product} prices are stable at ₦${Math.round(i.priceMean).toLocaleString()}/unit`,
  }))

  return {
    alerts,
    generatedAt: new Date().toISOString(),
  }
}
