// src/app/api/teams/[teamId]/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addTeamMember } from '@/lib/services/team.service';
import { TeamRole, Prisma} from '@prisma/client';

interface AddMemberRequest {
  userId: string;
  role?: TeamRole;
}

type RouteParams = {
  params: Promise<{ teamId: string }>;
};


export async function POST(
  request: NextRequest,
  routeParams: RouteParams
) {
  try {
    const { teamId } = await routeParams.params;

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    const body: AddMemberRequest = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const member = await addTeamMember(
      teamId,
      body.userId,
      body.role || TeamRole.MEMBER
    );

    return NextResponse.json(member);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'User is already a member of this team' },
        { status: 409 } // Conflict
      );
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Team or user not found' },
        { status: 404 } // Not Found
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add team member' },
      { status: 500 }
    );
  }
}