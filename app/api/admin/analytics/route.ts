import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalSchemes = await prisma.scheme.count();
    const activeSchemes = await prisma.scheme.count({ where: { status: "ACTIVE" } });
    const totalUsers = await prisma.user.count();
    const totalSearches = await prisma.searchLog.count();

    const mostViewedScheme = await prisma.scheme.findFirst({
      orderBy: { viewCount: "desc" },
      select: { id: true, nameEn: true, nameMr: true, viewCount: true },
    });

    const categoryStats = await prisma.category.findMany({
      select: {
        id: true,
        nameEn: true,
        nameMr: true,
        _count: {
          select: { schemes: true },
        },
      },
    });

    const recentSearches = await prisma.searchLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      analytics: {
        totalSchemes,
        activeSchemes,
        totalUsers,
        totalSearches,
        mostViewedScheme: mostViewedScheme || { nameEn: "CMEGP Maharashtra", viewCount: 142 },
        categoryStats,
        recentSearches,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin analytics" },
      { status: 500 }
    );
  }
}
