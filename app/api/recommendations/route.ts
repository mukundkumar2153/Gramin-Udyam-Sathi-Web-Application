import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateSchemeMatch, UserProfileQuery } from "@/lib/recommendation";

export async function POST(request: Request) {
  try {
    const userProfile: UserProfileQuery = await request.json();

    // Log the search for analytics
    await prisma.searchLog.create({
      data: {
        district: userProfile.district,
        businessType: userProfile.businessType,
        requirements: userProfile.requirements?.join(", "),
      },
    });

    const schemes = await prisma.scheme.findMany({
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
    return NextResponse.json(
      { success: false, error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
