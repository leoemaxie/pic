import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/purchases - Log a purchase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      retailerId,
      productId,
      quantity,
      unitPrice,
      totalPrice,
      wholesalerName,
      location,
      marketAvg,
    } = body;

    if (
      !retailerId ||
      !productId ||
      quantity === undefined ||
      unitPrice === undefined ||
      totalPrice === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine assessment
    let assessment = "fair";
    if (marketAvg && unitPrice > marketAvg) {
      assessment = "overpaid";
    } else if (marketAvg && unitPrice < marketAvg) {
      assessment = "opportunity";
    }

    const purchase = await prisma.purchase.create({
      data: {
        retailerId,
        productId,
        quantity,
        unitPrice,
        totalPrice,
        wholesalerName: wholesalerName || "Unknown",
        location,
        marketAvg,
        assessment,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: "purchase_logged",
        entityType: "purchase",
        entityId: purchase.id,
        status: "created",
        details: JSON.stringify({ assessment }),
      },
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("[purchases POST]", error);
    return NextResponse.json(
      { error: "Failed to log purchase" },
      { status: 500 }
    );
  }
}

// GET /api/purchases - List purchases for retailer
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const retailerId = searchParams.get("retailerId");
    const productId = searchParams.get("productId");
    const limit = searchParams.get("limit") || "50";

    if (!retailerId) {
      return NextResponse.json(
        { error: "retailerId required" },
        { status: 400 }
      );
    }

    const where: any = { retailerId };
    if (productId) where.productId = productId;

    const purchases = await prisma.purchase.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
    });

    // Calculate summary stats
    const stats = {
      total: purchases.length,
      spent: purchases.reduce((sum, p) => sum + p.totalPrice, 0),
      saved: purchases
        .filter((p) => p.assessment === "opportunity")
        .reduce((sum, p) => {
          const diff = (p.marketAvg || 0) - p.unitPrice;
          return sum + diff * p.quantity;
        }, 0),
      overpaid: purchases
        .filter((p) => p.assessment === "overpaid")
        .reduce((sum, p) => {
          const diff = p.unitPrice - (p.marketAvg || 0);
          return sum + diff * p.quantity;
        }, 0),
    };

    return NextResponse.json({ purchases, stats });
  } catch (error) {
    console.error("[purchases GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
