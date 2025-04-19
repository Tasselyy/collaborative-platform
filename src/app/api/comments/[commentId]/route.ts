import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  const {commentId} = await params;

  if (!commentId) {
    return NextResponse.json(
      { error: 'Missing commentId parameter' },
      { status: 400 }
    );
  }

  try {
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

