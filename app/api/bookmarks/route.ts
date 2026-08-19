import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, schemeId } = await request.json();

    if (!userId || !schemeId) {
      return NextResponse.json(
        { success: false, error: "userId and schemeId are required" },
        { status: 400 }
      );
    }

    const saved = await prisma.savedScheme.upsert({
      where: {
        userId_schemeId: { userId, schemeId },
      },
      update: {},
      create: { userId, schemeId },
    });

    return NextResponse.json({ success: true, saved });
  } catch (error: any) {
    console.error("POST /api/bookmarks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to bookmark scheme" },
      { status: 500 }
    );
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

    const savedSchemes = await prisma.savedScheme.findMany({
      where: { userId },
      include: {
        scheme: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, savedSchemes });
  } catch (error: any) {
    console.error("GET /api/bookmarks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch saved schemes" },
      { status: 500 }
    );
  }
}
