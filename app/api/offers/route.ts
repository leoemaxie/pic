import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to calculate multi-factor score
function calculateOfferScore(offer: any) {
  const PRICE_WEIGHT = 0.5;
  const DELIVERY_WEIGHT = 0.3;
  const DISTANCE_WEIGHT = 0.2;

  // Price score: lower is better, normalized to 0-1
  // Assume baseline of 100k (in smallest units)
  const priceScore = Math.max(0, 1 - offer.unitPrice / 100000);

  // Delivery score: lower is better
  let deliveryScore = 1.0;
  if (offer.deliveryETA?.includes("1 day") || offer.deliveryETA?.includes("same")) {
    deliveryScore = 1.0;
  } else if (offer.deliveryETA?.includes("2") || offer.deliveryETA?.includes("3")) {
    deliveryScore = 0.7;
  } else {
    deliveryScore = 0.4;
  }

  // Distance score: closer is better
  let distanceScore = 1.0;
  if (offer.distance === "same city") {
    distanceScore = 1.0;
  } else if (offer.distance === "nearby state") {
    distanceScore = 0.6;
  } else if (offer.distance === "far") {
    distanceScore = 0.3;
  }

  const compositeScore =
    PRICE_WEIGHT * priceScore +
    DELIVERY_WEIGHT * deliveryScore +
    DISTANCE_WEIGHT * distanceScore;

  return {
    score: compositeScore,
    priceScore,
    deliveryScore,
    distanceScore,
  };
}

// POST /api/offers - Create offer from structured reply
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rfqId, wholesalerId, productId, quantity, unitPrice, deliveryETA, location, distance } = body;

    if (!rfqId || !wholesalerId || !productId || quantity === undefined || !unitPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const scores = calculateOfferScore({
      unitPrice,
      deliveryETA,
      distance,
    });

    const offer = await prisma.offer.create({
      data: {
        rfqId,
        wholesalerId,
        productId,
        quantity,
        unitPrice,
        deliveryETA: deliveryETA || "TBD",
        location: location || "Unknown",
        distance: distance || "unknown",
        ...scores,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: "offer_received",
        entityType: "offer",
        entityId: offer.id,
        status: "created",
        details: JSON.stringify({ score: scores.score }),
      },
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error("[offers POST]", error);
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}

// GET /api/offers - List offers for RFQ (ranked)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rfqId = searchParams.get("rfqId");

    if (!rfqId) {
      return NextResponse.json(
        { error: "rfqId required" },
        { status: 400 }
      );
    }

    const offers = await prisma.offer.findMany({
      where: { rfqId },
      include: {
        wholesaler: { include: { user: true } },
        product: true,
      },
      orderBy: { score: { sort: "desc", nulls: "last" } },
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("[offers GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

// PATCH /api/offers/:id - Select an offer
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // If selecting, mark others as not selected for this RFQ
    if (body.selected === true) {
      const offer = await prisma.offer.findUnique({
        where: { id },
        select: { rfqId: true },
      });

      if (offer) {
        await prisma.offer.updateMany({
          where: { rfqId: offer.rfqId, id: { not: id } },
          data: { selected: false },
        });
      }
    }

    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: {
        ...body,
        selectedAt: body.selected === true ? new Date() : null,
      },
      include: { wholesaler: { include: { user: true } } },
    });

    // Log audit
    if (body.selected === true) {
      await prisma.auditLog.create({
        data: {
          action: "offer_selected",
          entityType: "offer",
          entityId: id,
          status: "selected",
        },
      });
    }

    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error("[offers PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}
