// src/lib/services/auth.service.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TeamMember, TeamRole } from '@prisma/client';

// Define specific result types
type AuthError = {
  success: false;
  error: NextResponse;
}

type AuthSuccess = {
  success: true;
  userId: string;
}

type MembershipSuccess = AuthSuccess & {
  member: TeamMember;
}

// Basic authentication check
export async function requireAuth(headers: Headers): Promise<AuthSuccess | AuthError> {
  const session = await auth.api.getSession({ headers });
  
  if (!session?.user?.id) {
    return {
      success: false,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }
  
  return {
    success: true,
    userId: session.user.id
  };
}

// Team membership check
export async function requireTeamMembership(
  headers: Headers, 
  teamId: string
): Promise<MembershipSuccess | AuthError> {
  // First check if user is authenticated
  const authCheck = await requireAuth(headers);
  
  if (!authCheck.success) {
    return authCheck; // Return the auth error
  }
  
  // At this point, TypeScript knows authCheck.userId exists and is a string
  const userId = authCheck.userId;
  
  // Then check team membership
  const currentMember = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
    },
  });
  
  if (!currentMember) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'You do not have access to this team' },
        { status: 403 }
      )
    };
  }
  
  return {
    success: true,
    userId,
    member: currentMember
  };
}

// Team ownership check
export async function requireTeamOwner(
  headers: Headers, 
  teamId: string
): Promise<MembershipSuccess | AuthError> {
  // Check membership first
  const memberCheck = await requireTeamMembership(headers, teamId);
  
  if (!memberCheck.success) {
    return memberCheck; // Return the error
  }
  
  // At this point, TypeScript knows memberCheck.member exists
  if (memberCheck.member.role !== TeamRole.OWNER) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Only the team owner can perform this action' },
        { status: 403 }
      )
    };
  }
  
  return memberCheck;
}