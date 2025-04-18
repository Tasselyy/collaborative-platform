// src/app/api/teams/[teamId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTeamById, disbandTeam} from '@/lib/services/team.service';
import { requireTeamMembership, requireTeamOwner } from '@/lib/services/auth.service';
import { Prisma } from '@prisma/client';

type RouteParams = {
  params: Promise<{ teamId: string }>;
};

export async function GET(
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
    // Check if the user is a member of the team
    const authResult = await requireTeamMembership(request.headers, teamId);
    if (!authResult.success) {
      return authResult.error;
    }
    const team = await getTeamById(teamId);

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team data' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if current user is the OWNER of the team
    const authResult = await requireTeamOwner(request.headers, teamId);
    if (!authResult.success) {
      return authResult.error;
    }

    // Use the service function to disband the team
    await disbandTeam(teamId);

    return NextResponse.json({ 
      message: 'Team disbanded successfully',
      teamId: teamId 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error disbanding team:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to disband team' },
      { status: 500 }
    );
  }
}