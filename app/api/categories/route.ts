import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { nameEn: "asc" },
      include: {
        _count: {
          select: { schemes: true },
        },
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
