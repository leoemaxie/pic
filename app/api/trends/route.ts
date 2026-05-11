import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/trends - Get price trends for a product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const retailerId = searchParams.get("retailerId");
    const productId = searchParams.get("productId");
    const days = searchParams.get("days") || "30";

    if (!retailerId || !productId) {
      return NextResponse.json(
        { error: "retailerId and productId required" },
        { status: 400 }
      );
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Get purchases for this product by retailer
    const purchases = await prisma.purchase.findMany({
      where: {
        retailerId,
        productId,
        createdAt: { gte: daysAgo },
      },
      include: { product: true },
      orderBy: { createdAt: "asc" },
    });

    // Get offers for RFQs by this retailer for this product
    const offers = await prisma.offer.findMany({
      where: {
        rfq: { retailerId, productId },
        createdAt: { gte: daysAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    // Calculate trend statistics
    const allPrices = [
      ...purchases.map((p) => ({
        date: p.createdAt,
        price: p.unitPrice,
        source: "purchase",
      })),
      ...offers.map((o) => ({ date: o.createdAt, price: o.unitPrice, source: "offer" })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    const minPrice = Math.min(
      ...allPrices.map((p) => p.price),
      Infinity
    );
    const maxPrice = Math.max(
      ...allPrices.map((p) => p.price),
      -Infinity
    );
    const avgPrice =
      allPrices.length > 0
        ? allPrices.reduce((sum, p) => sum + p.price, 0) / allPrices.length
        : 0;

    // Determine trend direction
    let trend = "stable";
    if (allPrices.length > 1) {
      const recent = allPrices.slice(-3).map((p) => p.price);
      const older = allPrices.slice(0, Math.max(1, allPrices.length - 3)).map((p) => p.price);
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

      if (recentAvg > olderAvg * 1.05) {
        trend = "rising";
      } else if (recentAvg < olderAvg * 0.95) {
        trend = "falling";
      }
    }

    return NextResponse.json({
      productId,
      days: parseInt(days),
      minPrice,
      maxPrice,
      avgPrice,
      trend,
      priceHistory: allPrices,
      purchaseCount: purchases.length,
      offerCount: offers.length,
    });
  } catch (error) {
    console.error("[trends GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
