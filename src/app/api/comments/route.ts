// src/app/api/comments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure you have your Prisma client exported from here

// GET: Fetch all comments for a given visualization ID via query parameter (vizId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vizId = searchParams.get("vizId");

  if (!vizId) {
    return NextResponse.json({ error: "Missing vizId parameter" }, { status: 400 });
  }
  try {
    const comments = await prisma.comment.findMany({
      where: { vizId },
      include: { author: true }, // Include author details if needed
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
  }
}

// POST: Add a new comment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vizId, content, currentUserId } = body;
    
    const authorId = currentUserId;
    if (!vizId || !content || !currentUserId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const comment = await prisma.comment.create({
      data: {
        vizId,
        content,
        authorId,
      },
      include: { author: true },
    });
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

