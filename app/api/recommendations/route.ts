import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateSchemeMatch, UserProfileQuery } from "@/lib/recommendation";
import { STATIC_SCHEMES } from "@/lib/data/schemes";

export async function POST(request: Request) {
  try {
    const userProfile: UserProfileQuery = await request.json();

    let schemes: any[] = [];

    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_NEON_PASSWORD")) {
      try {
        await prisma.searchLog.create({
          data: {
            district: userProfile.district,
            businessType: userProfile.businessType,
            requirements: userProfile.requirements?.join(", "),
          },
        });

        schemes = await prisma.scheme.findMany({
          where: { status: "ACTIVE" },
          include: {
            category: true,
            districts: {
              include: {
                district: true,
              },
            },
          },
        });
      } catch (err) {
        // fallback
      }
    }

    if (!schemes || schemes.length === 0) {
      schemes = STATIC_SCHEMES;
    }

    const results = schemes.map((scheme) => {
      const match = calculateSchemeMatch(scheme, userProfile);
      return {
        scheme,
        matchScore: match.matchScore,
        criteria: match.criteria,
        relevantReasonEn: match.relevantReasonEn,
        relevantReasonHi: match.relevantReasonHi,
        relevantReasonMr: match.relevantReasonMr,
      };
    });

    // Sort schemes by match score descending
    results.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      recommendations: results,
      totalCount: results.length,
    });
  } catch (error: any) {
    console.error("POST /api/recommendations error:", error);
    const results = STATIC_SCHEMES.map((scheme) => {
      const match = calculateSchemeMatch(scheme, {});
      return {
        scheme,
        matchScore: match.matchScore,
        criteria: match.criteria,
        relevantReasonEn: match.relevantReasonEn,
        relevantReasonHi: match.relevantReasonHi,
        relevantReasonMr: match.relevantReasonMr,
      };
    });
    return NextResponse.json({
      success: true,
      recommendations: results,
      totalCount: results.length,
    });
  }
}
