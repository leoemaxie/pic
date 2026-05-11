import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to send RFQ message
async function sendRFQMessage(
  messageId: string,
  wholesalerPhone: string,
  productName: string,
  quantity: number,
  unit: string
) {
  const isSimulation = process.env.NEXT_PUBLIC_SIMULATION_MODE === "true";

  if (isSimulation) {
    // Simulation mode: just mark as sent
    return { success: true, messageId, simulated: true };
  }

  // Real Twilio integration
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

    if (!accountSid || !authToken || !fromNumber) {
      console.error("Missing Twilio credentials");
      return { success: false, error: "Twilio not configured" };
    }

    const messageBody = `Hi! We are looking for ${quantity} ${unit}(s) of ${productName}. Please reply with your best price, delivery time, and location. Thank you!`;

    // Twilio API call would go here
    // const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
    //   },
    //   body: new URLSearchParams({
    //     From: fromNumber,
    //     To: wholesalerPhone,
    //     Body: messageBody,
    //   }),
    // });

    // For now, just return success
    return { success: true, messageId };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: String(error) };
  }
}

// POST /api/messages/send - Send RFQ messages to wholesalers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rfqId } = body;

    if (!rfqId) {
      return NextResponse.json(
        { error: "rfqId required" },
        { status: 400 }
      );
    }

    // Get RFQ with messages and product
    const rfq = await prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: {
        messages: { include: { wholesaler: { include: { user: true } } } },
        product: true,
      },
    });

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    const results = [];

    // Send to each wholesaler
    for (const msg of rfq.messages) {
      if (!msg.wholesaler?.user) continue;

      const sendResult = await sendRFQMessage(
        msg.id,
        msg.wholesaler.user.phone,
        rfq.product.name,
        rfq.quantity,
        rfq.unit
      );

      if (sendResult.success) {
        await prisma.rFQMessage.update({
          where: { id: msg.id },
          data: {
            status: "sent",
            sentAt: new Date(),
            messageId: sendResult.messageId || msg.id,
          },
        });

        results.push({ messageId: msg.id, success: true });
      } else {
        await prisma.rFQMessage.update({
          where: { id: msg.id },
          data: { status: "failed" },
        });

        results.push({
          messageId: msg.id,
          success: false,
          error: sendResult.error,
        });
      }
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: "messages_sent",
        entityType: "rfq",
        entityId: rfqId,
        status: "sent",
        details: JSON.stringify({ count: results.length }),
      },
    });

    return NextResponse.json({ rfqId, results });
  } catch (error) {
    console.error("[messages/send POST]", error);
    return NextResponse.json(
      { error: "Failed to send messages" },
      { status: 500 }
    );
  }
}
