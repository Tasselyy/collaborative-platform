import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth" 
import { headers } from "next/headers"
import { Visibility } from "@prisma/client";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const {
      name,
      description,
      fileName,
      fileUrl,
      ownerId,
      visibility,
      teamId, 
    } = body;
    try {
        const dataset = await prisma.dataset.create({
            data: {
                name,
                description,
                fileName,
                fileUrl,
                ownerId,
                visibility, 
                teamId,
              },
        }) 
        return NextResponse.json(dataset, { status: 201 })       
    } catch (error) {
        console.error('Create dataset error:', error)
        return NextResponse.json({ error: 'Failed to create dataset' }, { status: 500 })
    }
}
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get('teamId');

  let teamAllowed = false;

  if (teamId) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    teamAllowed = !!team && team.members.length > 0;
  }

  // Build conditional where clause
  const datasets = await prisma.dataset.findMany({
    where: {
      OR: [
        { visibility: Visibility.PUBLIC },
        { visibility: Visibility.PRIVATE, ownerId: userId },
        ...(teamAllowed && teamId
          ? [
              {
                visibility: Visibility.TEAM,
                teamId: teamId,
              },
            ]
          : []),
      ],
    },
    include: {
      owner: true,
      team: true,
      _count: {
        select: { visualizations: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatted = datasets.map((ds) => ({
    id: ds.id,
    name: ds.name,
    description: ds.description,
    createdAt: ds.createdAt.toISOString(),
    team: ds.team?.name ?? '',
    visibility: ds.visibility,
    visualizations: ds._count.visualizations,
    owner: ds.owner.name,
    fileName: ds.fileName,
  }));

  return NextResponse.json(formatted);
}