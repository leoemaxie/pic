import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to parse structured reply
// Expected format: PRODUCT|PRICE|QTY|DELIVERY_ETA|LOCATION|DISTANCE
// Example: RICE|72000|50|2 days|Kano|same city
function parseStructuredReply(text: string) {
  try {
    const parts = text.split("|").map((p) => p.trim());

    if (parts.length < 5) {
      return { error: "Invalid format. Expected: PRODUCT|PRICE|QTY|DELIVERY_ETA|LOCATION" };
    }

    const [product, priceStr, qtyStr, deliveryETA, location, distance] = parts;
    const price = parseInt(priceStr);
    const qty = parseInt(qtyStr);

    if (isNaN(price) || isNaN(qty)) {
      return { error: "Invalid price or quantity" };
    }

    return {
      success: true,
      data: {
        product,
        unitPrice: price,
        quantity: qty,
        deliveryETA,
        location,
        distance: distance || "unknown",
      },
    };
  } catch (error) {
    return { error: String(error) };
  }
}

// POST /api/messages/webhook - Twilio webhook for inbound messages
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get("From") as string;
    const body = formData.get("Body") as string;

    if (!from || !body) {
      return NextResponse.json(
        { error: "Missing From or Body" },
        { status: 400 }
      );
    }

    // Find the wholesale user by phone
    const wholesaler = await prisma.wholesaler.findFirst({
      where: { user: { phone: from } },
      include: { user: true },
    });

    if (!wholesaler) {
      // Unknown wholesaler
      return NextResponse.json({
        status: "skipped",
        reason: "Wholesaler not found",
      });
    }

    // Find messages from this wholesaler with status "awaiting"
    const messages = await prisma.rFQMessage.findMany({
      where: {
        wholesalerId: wholesaler.id,
        replyStatus: "awaiting",
      },
      include: { rfq: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 1, // Get the most recent
    });

    if (messages.length === 0) {
      return NextResponse.json({
        status: "skipped",
        reason: "No pending RFQs for this wholesaler",
      });
    }

    const message = messages[0];
    const parseResult = parseStructuredReply(body);

    if ("error" in parseResult) {
      // Update message with error
      await prisma.rFQMessage.update({
        where: { id: message.id },
        data: {
          replyStatus: "error",
          rawReply: body,
        },
      });

      // Log audit
      await prisma.auditLog.create({
        data: {
          action: "message_parse_error",
          entityType: "message",
          entityId: message.id,
          status: "error",
          details: parseResult.error,
        },
      });

      return NextResponse.json({ status: "error", details: parseResult.error });
    }

    // Parse succeeded
    const { data } = parseResult;

    // Create offer
    const offer = await prisma.offer.create({
      data: {
        rfqId: message.rfqId,
        wholesalerId: wholesaler.id,
        productId: message.rfq.productId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        deliveryETA: data.deliveryETA,
        location: data.location,
        distance: data.distance,
      },
    });

    // Update message status
    await prisma.rFQMessage.update({
      where: { id: message.id },
      data: {
        replyStatus: "parsed",
        rawReply: body,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: "message_parsed",
        entityType: "message",
        entityId: message.id,
        status: "parsed",
        details: JSON.stringify({ offerId: offer.id }),
      },
    });

    return NextResponse.json({
      status: "success",
      offerId: offer.id,
      offer,
    });
  } catch (error) {
    console.error("[messages/webhook POST]", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
