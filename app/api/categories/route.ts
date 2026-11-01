import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STATIC_CATEGORIES } from "@/lib/data/categories";

export async function GET() {
  try {
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_NEON_PASSWORD")) {
      try {
        const categories = await prisma.category.findMany({
          orderBy: { nameEn: "asc" },
          include: {
            _count: {
              select: { schemes: true },
            },
          },
        });
        if (categories && categories.length > 0) {
          return NextResponse.json({ success: true, categories });
        }
      } catch (e) {
        // fallback
      }
    }

    return NextResponse.json({ success: true, categories: STATIC_CATEGORIES });
  } catch (error: any) {
    return NextResponse.json({ success: true, categories: STATIC_CATEGORIES });
  }
}
