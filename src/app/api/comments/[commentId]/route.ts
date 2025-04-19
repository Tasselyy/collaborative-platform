// DELETE: Delete a comment by its ID via query parameter (commentId)
// src/app/api/comments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure you have your Prisma client exported from here


export async function DELETE(
    request: Request,
    { params }: { params: { commentId: string } }
  ) {
    const { commentId } = await params;
  
    if (!commentId) {
      return NextResponse.json({ error: "Missing commentId parameter" }, { status: 400 });
    }
  
    try {
      const deletedComment = await prisma.comment.delete({
        where: { id: commentId },
      });
      return NextResponse.json(deletedComment);
    } catch (error) {
      console.error("Error deleting comment:", error);
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
  }