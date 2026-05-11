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

// GET /api/rfqs/:id - Get single RFQ
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const rfq = await prisma.rFQ.findUnique({
      where: { id },
      include: {
        product: true,
        messages: { include: { wholesaler: true } },
        offers: { orderBy: { score: { sort: "desc", nulls: "last" } } },
      },
    });

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    return NextResponse.json(rfq);
  } catch (error) {
    console.error("[rfqs/:id GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch RFQ" },
      { status: 500 }
    );
  }
}

// PATCH /api/rfqs/:id - Update RFQ status
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const rfq = await prisma.rFQ.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(rfq);
  } catch (error) {
    console.error("[rfqs PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update RFQ" },
      { status: 500 }
    );
  }
}
