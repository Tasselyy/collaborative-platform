// src/app/api/teams/[teamId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTeamById } from '@/lib/services/team.service';

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