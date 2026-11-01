import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "ready";
  let dbLatency: number | undefined = undefined;

  // Wake up database (Neon / PostgreSQL) if configured
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_NEON_PASSWORD")) {
    try {
      const dbStart = Date.now();
      // Lightweight query to keep Neon DB active and prevent auto-suspend
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
      dbStatus = "connected";
    } catch (err: any) {
      dbStatus = "disconnected";
    }
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      status: "ok",
      message: "Gramin Udyam Sathi kept alive successfully",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      server: "awake",
      database: dbStatus,
      responseTime: `${responseTime}ms`,
      ...(dbLatency !== undefined ? { dbLatency: `${dbLatency}ms` } : {}),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    }
  );
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
