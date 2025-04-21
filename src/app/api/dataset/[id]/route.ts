// File: app/api/dataset/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { auth } from "@/lib/auth" 
import { headers } from "next/headers"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {id} = await params;
    
  
    const dataset = await prisma.dataset.findUnique({
      where: { id: id },
      include: {
        team: {
          select: {
            name: true
          }
        },
        owner: {
          select: {
            name: true
          }
        },
        visualizations: true
      }
    });
    if (!dataset) {
      return NextResponse.json(
        { error: "Dataset not found" },
        { status: 404 }
      );
    }
    
    const formattedDataset = {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      createdAt: dataset.createdAt.toISOString(),
      team: dataset.team?.name || null,
      visibility: dataset.visibility,
      visualizations: dataset.visualizations?.length || 0,
      owner: dataset.owner?.name || ""
    };
    
    return NextResponse.json(formattedDataset);
  } catch (error) {
    console.error("Error fetching dataset:", error);
    return NextResponse.json(
      { error: "Failed to fetch dataset" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const dataset = await prisma.dataset.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }

    if (dataset.ownerId !== session.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates = await request.json();

    // Ensure only these fields can be updated
    const { name, description, visibility, teamId } = updates;

    if (visibility === "TEAM") {
      if (!teamId) {
        return NextResponse.json(
          { error: "teamId is required for TEAM visibility" },
          { status: 400 }
        );
      }
    
      // ✅ Check if the team actually exists
      const teamExists = await prisma.team.findUnique({
        where: { id: teamId },
        select: { id: true }, // only fetch id for efficiency
      });
    
      if (!teamExists) {
        return NextResponse.json(
          { error: "The specified team does not exist" },
          { status: 404 }
        );
      }
    }
    const updatedDataset = await prisma.dataset.update({
      where: { id },
      data: {
        name,
        description,
        visibility,
        teamId: visibility === "TEAM" ? teamId : null,
      },
      include: {
        team: { select: { name: true } },
        owner: { select: { name: true } },
        _count: {
          select: { visualizations: true }
        }
      },
    });

    return NextResponse.json({
      id: updatedDataset.id,
      name: updatedDataset.name,
      description: updatedDataset.description,
      createdAt: updatedDataset.createdAt.toISOString(),
      team: updatedDataset.team?.name || null,
      visibility: updatedDataset.visibility,
      visualizations: updatedDataset._count.visualizations,
      owner: updatedDataset.owner?.name || "",
    });
  } catch (error) {
    console.error("Error updating dataset:", error);
    return NextResponse.json(
      { error: "Failed to update dataset" },
      { status: 500 }
    );
  }
}