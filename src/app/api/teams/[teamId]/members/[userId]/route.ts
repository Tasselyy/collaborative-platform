import { NextRequest, NextResponse } from 'next/server';
import { removeTeamMember } from '@/lib/services/team.service';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Get current session
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if current user is the OWNER of the team
    const currentMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    if (!currentMember || currentMember.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Only the team owner can remove members' },
        { status: 403 }
      );
    }

    // Prevent owner from removing themselves
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: 'You cannot remove yourself as the owner' },
        { status: 400 }
      );
    }

    await removeTeamMember(teamId, userId);

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Error removing team member:', error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}