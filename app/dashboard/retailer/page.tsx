import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import RetailerDashboardClient from './RetailerDashboardClient'

export default async function RetailerDashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get('pic-token')?.value
  if (!token) redirect('/login')

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'retailer') redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) redirect('/login')

  const recentLogs = await prisma.purchaseLog.findMany({
    where: { userId: user.id },
    orderBy: { timestamp: 'desc' },
    take: 10,
  })

  const briefing = await prisma.briefing.findFirst({
    where: { userId: user.id, delivered: false },
    orderBy: { createdAt: 'desc' },
  })

  const products = [...new Set(recentLogs.map(l => l.product))]
  const marketData = await prisma.marketIntelligence.findMany({
    where: products.length > 0 ? { product: { in: products } } : {},
    orderBy: { lastUpdated: 'desc' },
    take: 10,
  })

  if (briefing) {
    await prisma.briefing.update({ where: { id: briefing.id }, data: { delivered: true } })
  }

  return (
    <RetailerDashboardClient
      user={{ id: user.id, shopName: user.shopName, location: user.location, role: user.role }}
      recentLogs={recentLogs.map(l => ({
        ...l,
        timestamp: l.timestamp.toISOString(),
      }))}
      briefing={briefing ? JSON.parse(briefing.content) : null}
      marketData={marketData}
    />
  )
}
