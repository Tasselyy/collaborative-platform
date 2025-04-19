// src/app/api/teams/[teamId]/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addTeamMember } from '@/lib/services/team.service';
import { TeamRole, Prisma} from '@prisma/client';
import { requireTeamOwner } from '@/lib/services/auth.service';


interface AddMembersRequest {
  members: {
    userId: string;
    role?: TeamRole;
  }[];
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
    // Check authorization
    const auth = await requireTeamOwner(request.headers, teamId);
    
    if (!auth.success) {
      return auth.error;
    }
    console.log(`Team owner ${auth.userId} performing action`);

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }
    console.log(`Team owner ${auth.userId} performing action`);
    const body: AddMembersRequest = await request.json();

    if (!body.members || !Array.isArray(body.members) || body.members.length === 0) {
      return NextResponse.json({ error: 'No members provided' }, { status: 400 });
    }

    const results = [];

    for (const { userId, role } of body.members) {
      if (!userId) continue;

      try {
        const member = await addTeamMember(
          teamId,
          userId,
          role || TeamRole.MEMBER
        );
        results.push(member);
      } catch (err: any) {
        // Skip duplicates silently or log
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          console.log("already a member")
          continue; // already a member
        }
        console.error(`Failed to add ${userId}:`, err);
      }
    }

    return NextResponse.json({ added: results.length, members: results });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: 'Failed to add team members' }, { status: 500 });
  }
}