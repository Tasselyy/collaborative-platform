// src/lib/services/team.service.ts
import { prisma } from '@/lib/prisma';
import { TeamRole } from '@prisma/client';

export interface TeamMemberResponse {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  role: TeamRole;
  joinedAt: string;
}

export interface TeamResponse {
  id: string;
  name: string;
  description?: string;
  members: TeamMemberResponse[];
  createdAt: string;
}

export async function getTeamById(teamId: string): Promise<TeamResponse | null> {
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!team) {
    return null;
  }

  // Transform to expected response format
  return {
    id: team.id,
    name: team.name,
    description: team.description || undefined,
    createdAt: team.createdAt.toISOString(),
    members: team.members.map(member => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image || undefined,
      role: member.role,
      joinedAt: member.joinedAt.toISOString(),
    })),
  };
}

export async function addTeamMember(
  teamId: string, 
  userId: string, 
  role: TeamRole = TeamRole.MEMBER
): Promise<TeamMemberResponse> {
  const teamMember = await prisma.teamMember.create({
    data: {
      team: {
        connect: { id: teamId },
      },
      user: {
        connect: { id: userId },
      },
      role,
    },
    include: {
      user: true,
    },
  });

  return {
    id: teamMember.user.id,
    name: teamMember.user.name,
    email: teamMember.user.email,
    image: teamMember.user.image || undefined,
    role: teamMember.role,
    joinedAt: teamMember.joinedAt.toISOString(),
  };
}

export async function removeTeamMember(
  teamId: string,
  userId: string
): Promise<boolean> {
  const result = await prisma.teamMember.delete({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  return !!result;
}

export async function disbandTeam(teamId: string) {
  return prisma.team.delete({
    where: {
      id: teamId
    }
  });
}

export async function createTeam(name: string, ownerId: string, memberIds: string[] = []) {
  return prisma.team.create({
    data: {
      name,
      members: {
        create: [
          {
            userId: ownerId,
            role: TeamRole.OWNER,
          },
          ...memberIds.map((id) => ({
            userId: id,
            role: TeamRole.MEMBER,
          })),
        ],
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function getUserTeams(userId: string) {
  const userTeams = await prisma.teamMember.findMany({
    where: {
      userId: userId
    },
    include: {
      team: true
    },
    orderBy: {
      joinedAt: 'desc'
    }
  });

  // Transform the data to a more frontend-friendly format
  return userTeams.map(membership => ({
    id: membership.team.id,
    name: membership.team.name,
    description: membership.team.description,
    role: membership.role,
    joinedAt: membership.joinedAt
  }));
}