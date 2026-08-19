import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const districts = await prisma.district.findMany({
      orderBy: { nameEn: "asc" },
      include: {
        _count: {
          select: { schemes: true },
        },
      },
    });

    return NextResponse.json({ success: true, districts, count: districts.length });
  } catch (error: any) {
    console.error("GET /api/districts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch districts" },
      { status: 500 }
    );
  }
}
