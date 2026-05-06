import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import WholesalerDashboardClient from './WholesalerDashboardClient'

export default async function WholesalerDashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get('pic-token')?.value
  if (!token) redirect('/login')

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'wholesaler') redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) redirect('/login')

  const prices = await prisma.wholesalerPrice.findMany({
    where: { wholesalerId: user.id },
    orderBy: { lastUpdated: 'desc' },
  })

  const productList = prices.map(p => p.product)
  const recentRetailPurchases = await prisma.purchaseLog.groupBy({
    by: ['product'],
    _count: { id: true },
    _avg: { pricePerUnit: true },
    where: {
      timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      ...(productList.length > 0 ? { product: { in: productList } } : {}),
    },
    orderBy: { _count: { id: 'desc' } },
  })

  const threads = await prisma.messageThread.findMany({
    where: { wholesalerId: user.id },
    include: {
      retailer: { select: { shopName: true } },
      messages: { orderBy: { timestamp: 'desc' }, take: 1 },
    },
    orderBy: { lastMessageAt: 'desc' },
  })

  return (
    <WholesalerDashboardClient
      user={{ id: user.id, shopName: user.shopName, location: user.location }}
      prices={prices.map(p => ({
        ...p,
        lastUpdated: p.lastUpdated.toISOString(),
      }))}
      demandSignals={recentRetailPurchases.map(p => ({
        product: p.product,
        buyerCount: p._count.id,
        avgPrice: p._avg.pricePerUnit || 0,
      }))}
      threads={threads.map(t => ({
        id: t.id,
        retailerName: t.retailer.shopName,
        product: t.product,
        lastMessage: t.messages[0]?.text || '',
        lastMessageAt: t.lastMessageAt.toISOString(),
      }))}
    />
  )
}
