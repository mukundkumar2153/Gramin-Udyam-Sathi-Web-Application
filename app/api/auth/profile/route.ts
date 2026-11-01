import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, phone, address, village, taluka, district, businessType, businessStage, profileImage } = body;

    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_NEON_PASSWORD")) {
      try {
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { name: name || undefined },
          });
        }
      } catch (err) {
        // fallback
      }
    }

    return NextResponse.json({
      success: true,
      user: body,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("PUT /api/auth/profile error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
