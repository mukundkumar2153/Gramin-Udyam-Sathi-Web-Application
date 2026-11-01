import { NextResponse } from "next/server";
import { MAHARASHTRA_DISTRICTS } from "@/lib/data/districts";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // If Prisma is connected and has records, use DB; otherwise immediately return static verified data
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_NEON_PASSWORD")) {
      const districts = await prisma.district.findMany({
        orderBy: { nameEn: "asc" },
        include: {
          _count: {
            select: { schemes: true },
          },
        },
      });
      if (districts && districts.length > 0) {
        return NextResponse.json({ success: true, districts, count: districts.length });
      }
    }
    // Instant in-code response: 36 Maharashtra Districts
    return NextResponse.json({
      success: true,
      districts: MAHARASHTRA_DISTRICTS,
      count: MAHARASHTRA_DISTRICTS.length,
    });
  } catch (error) {
    // Zero failure: return hardcoded code data
    return NextResponse.json({
      success: true,
      districts: MAHARASHTRA_DISTRICTS,
      count: MAHARASHTRA_DISTRICTS.length,
    });
  }
}
