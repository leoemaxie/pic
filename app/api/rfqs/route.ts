import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/rfqs - Create and fan-out RFQ
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { retailerId, productId, quantity, unit, triggeredBy } = body;

    if (!retailerId || !productId || !quantity || !unit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create RFQ
    const rfq = await prisma.rFQ.create({
      data: {
        retailerId,
        productId,
        quantity,
        unit,
        triggeredBy: triggeredBy || "manual",
      },
    });

    // Get suppliers for this retailer
    const suppliers = await prisma.supplierContact.findMany({
      where: {
        retailerId,
        consentedToRFQ: true,
      },
    });

    // Fan out messages
    const messages = await Promise.all(
      suppliers.map((supplier) =>
        prisma.rFQMessage.create({
          data: {
            rfqId: rfq.id,
            wholesalerId: supplier.wholesalerId || "", // Will be populated if linked
            channel: "whatsapp",
            status: "pending",
          },
        })
      )
    );

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: "rfq_created",
        entityType: "rfq",
        entityId: rfq.id,
        status: "created",
        details: JSON.stringify({ suppliers: suppliers.length }),
      },
    });

    return NextResponse.json(
      {
        rfq,
        messageCount: messages.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[rfqs POST]", error);
    return NextResponse.json(
      { error: "Failed to create RFQ" },
      { status: 500 }
    );
  }
}

// GET /api/rfqs - List RFQs for retailer
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const retailerId = searchParams.get("retailerId");

    if (!retailerId) {
      return NextResponse.json(
        { error: "retailerId required" },
        { status: 400 }
      );
    }

    const rfqs = await prisma.rFQ.findMany({
      where: { retailerId },
      include: {
        product: true,
        messages: { include: { wholesaler: true } },
        offers: { orderBy: { score: { sort: "desc", nulls: "last" } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rfqs);
  } catch (error) {
    console.error("[rfqs GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch RFQs" },
      { status: 500 }
    );
  }
}

