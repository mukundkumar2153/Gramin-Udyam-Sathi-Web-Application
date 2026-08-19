import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const scheme = await prisma.scheme.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        districts: {
          include: {
            district: true,
          },
        },
      },
    });

    if (!scheme) {
      return NextResponse.json(
        { success: false, error: "Scheme not found" },
        { status: 404 }
      );
    }

    // Increment view count asynchronously
    await prisma.scheme.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, scheme });
  } catch (error: any) {
    console.error("GET /api/schemes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scheme details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedScheme = await prisma.scheme.update({
      where: { id: params.id },
      data: {
        ...body,
        lastVerifiedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, scheme: updatedScheme });
  } catch (error: any) {
    console.error("PUT /api/schemes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update scheme" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.scheme.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Scheme deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/schemes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete scheme" },
      { status: 500 }
    );
  }
}
