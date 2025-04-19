// src/app/api/users/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    // Use auth service to check authentication
    const authResult = await requireAuth(req.headers);
    if (!authResult.success) {
      return authResult.error;
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        NOT: { id: authResult.userId },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 10,
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}