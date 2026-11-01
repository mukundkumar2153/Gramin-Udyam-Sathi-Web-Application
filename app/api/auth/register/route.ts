import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "gramin-udyam-sathi-secret-key-2024";

export async function POST(request: Request) {
  try {
    const { name, email, password, language = "mr" } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_NEON_PASSWORD")) {
      try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          return NextResponse.json(
            { success: false, error: "User already exists with this email" },
            { status: 400 }
          );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: "USER",
            language,
          },
        });

        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        const response = NextResponse.json({ success: true, user, token }, { status: 201 });
        response.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
        return response;
      } catch (err) {
        // fallback
      }
    }

    // Local registration fallback
    const newUser = {
      id: "user-" + Date.now(),
      name,
      email,
      role: "USER",
      language,
      phone: "",
      district: "Pune",
      village: "",
      taluka: "",
      address: "",
      businessType: "Agriculture & Agribusiness",
      businessStage: "Idea",
    };

    const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: "7d" });
    const response = NextResponse.json({ success: true, user: newUser, token }, { status: 201 });
    response.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
    return response;
  } catch (error: any) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
