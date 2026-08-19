import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const district = searchParams.get("district") || "";
    const limit = parseInt(searchParams.get("limit") || "50");

    const whereCondition: any = {
      status: "ACTIVE",
    };

    if (search) {
      whereCondition.OR = [
        { nameEn: { contains: search, mode: "insensitive" } },
        { nameHi: { contains: search, mode: "insensitive" } },
        { nameMr: { contains: search, mode: "insensitive" } },
        { descriptionEn: { contains: search, mode: "insensitive" } },
        { descriptionMr: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      whereCondition.category = {
        slug: category,
      };
    }

    if (district) {
      whereCondition.districts = {
        some: {
          district: {
            slug: district,
          },
        },
      };
    }

    const schemes = await prisma.scheme.findMany({
      where: whereCondition,
      include: {
        category: true,
        districts: {
          include: {
            district: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, schemes, count: schemes.length });
  } catch (error: any) {
    console.error("GET /api/schemes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch schemes from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nameEn,
      nameHi,
      nameMr,
      descriptionEn,
      descriptionHi,
      descriptionMr,
      categoryId,
      targetUsersEn,
      targetUsersHi,
      targetUsersMr,
      benefitsJson,
      eligibilityJson,
      documentsJson,
      applicationProcessJson,
      officialUrl,
      sourceName,
      applicableScope,
    } = body;

    if (!nameEn || !nameMr || !categoryId || !officialUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required scheme fields" },
        { status: 400 }
      );
    }

    const newScheme = await prisma.scheme.create({
      data: {
        nameEn,
        nameHi: nameHi || nameEn,
        nameMr: nameMr || nameEn,
        descriptionEn,
        descriptionHi: descriptionHi || descriptionEn,
        descriptionMr: descriptionMr || descriptionEn,
        categoryId,
        targetUsersEn: targetUsersEn || "All Entrepreneurs",
        targetUsersHi: targetUsersHi || targetUsersEn || "सभी उद्यमी",
        targetUsersMr: targetUsersMr || targetUsersEn || "सर्व उद्योजक",
        benefitsJson: benefitsJson || [],
        eligibilityJson: eligibilityJson || {},
        documentsJson: documentsJson || [],
        applicationProcessJson: applicationProcessJson || [],
        officialUrl,
        sourceName: sourceName || "Govt of Maharashtra",
        applicableScope: applicableScope || "Maharashtra State",
        lastVerifiedAt: new Date(),
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, scheme: newScheme }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/schemes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create scheme" },
      { status: 500 }
    );
  }
}
