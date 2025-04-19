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
      visualizations: dataset.visualization?.length || 0,
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
        team: true,
        owner: true
      }
    });
  
    if (!dataset) {
      return NextResponse.json(
        { error: "Dataset not found" },
        { status: 404 }
      );
    }
    

    const currentUserId = session.user?.id;
 
    if (dataset.ownerId !== currentUserId) {
      return NextResponse.json(
        { error: "You don't have permission to edit this dataset" },
        { status: 403 }
      );
    }
    
    const updates = await request.json();
    const allowedFields = ["name", "description", "visibility"];
    const sanitizedUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as Record<string, any>);
    

    const updatedDataset = await prisma.dataset.update({
      where: { id: id },
      data: sanitizedUpdates,
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
        }
      }
    });
    
  
    const formattedUpdatedDataset = {
      id: updatedDataset.id,
      name: updatedDataset.name,
      description: updatedDataset.description,
      createdAt: updatedDataset.createdAt.toISOString(),
      team: updatedDataset.team?.name || null,
      visibility: updatedDataset.visibility,
      visualizations: updatedDataset.visualizations?.length || 0,
      owner: updatedDataset.owner?.name || ""
    };
    
    return NextResponse.json(formattedUpdatedDataset);
  } catch (error) {
    console.error("Error updating dataset:", error);
    return NextResponse.json(
      { error: "Failed to update dataset" },
      { status: 500 }
    );
  }
}