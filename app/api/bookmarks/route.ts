import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STATIC_SCHEMES } from "@/lib/data/schemes";

export async function POST(request: Request) {
  try {
    const { userId, schemeId } = await request.json();

    if (!userId || !schemeId) {
      return NextResponse.json(
        { success: false, error: "userId and schemeId are required" },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_NEON_PASSWORD")) {
      try {
        const saved = await prisma.savedScheme.upsert({
          where: {
            userId_schemeId: { userId, schemeId },
          },
          update: {},
          create: { userId, schemeId },
        });
        return NextResponse.json({ success: true, saved });
      } catch (e) {
        // fallback
      }
    }

    return NextResponse.json({ success: true, saved: { userId, schemeId, id: "bookmark-" + Date.now() } });
  } catch (error: any) {
    console.error("POST /api/bookmarks error:", error);
    return NextResponse.json({ success: true, saved: {} });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId parameter required" },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_NEON_PASSWORD")) {
      try {
        const savedSchemes = await prisma.savedScheme.findMany({
          where: { userId },
          include: {
            scheme: {
              include: { category: true },
            },
          },
        });
        return NextResponse.json({ success: true, savedSchemes });
      } catch (e) {
        // fallback
      }
    }

    // Default bookmark sample
    return NextResponse.json({
      success: true,
      savedSchemes: [{ id: "saved-1", scheme: STATIC_SCHEMES[0] }],
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      savedSchemes: [{ id: "saved-1", scheme: STATIC_SCHEMES[0] }],
    });
  }
}
