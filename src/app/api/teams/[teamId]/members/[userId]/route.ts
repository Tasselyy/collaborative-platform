import { NextRequest, NextResponse } from 'next/server';
import { removeTeamMember } from '@/lib/services/team.service';
import { Prisma } from '@prisma/client';

type RouteParams = {
  params: Promise<{ teamId: string; userId: string }>;
};

export async function DELETE(
  request: NextRequest,
  routeParams: RouteParams
) {
  try {
    const { teamId, userId } = await routeParams.params;

    if (!teamId || !userId) {
      return NextResponse.json(
        { error: 'Team ID and User ID are required' },
        { status: 400 }
      );
    }

    await removeTeamMember(teamId, userId);

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    console.error('Error removing team member:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}