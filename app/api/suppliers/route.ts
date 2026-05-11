import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/suppliers - Create supplier contact
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { retailerId, name, phone, region } = body;

    if (!retailerId || !name || !phone || !region) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplierContact.create({
      data: {
        retailerId,
        name,
        phone,
        region,
      },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error("[suppliers POST]", error);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}

// GET /api/suppliers - List suppliers for retailer
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

    const suppliers = await prisma.supplierContact.findMany({
      where: { retailerId },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("[suppliers GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

// PUT /api/suppliers/:id - Update supplier
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const supplier = await prisma.supplierContact.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[suppliers PUT]", error);
    return NextResponse.json(
      { error: "Failed to update supplier" },
      { status: 500 }
    );
  }
}

// DELETE /api/suppliers/:id - Delete supplier
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.supplierContact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[suppliers DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete supplier" },
      { status: 500 }
    );
  }
}
