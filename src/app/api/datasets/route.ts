import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth" 
import { headers } from "next/headers"


export async function POST(req: NextRequest) {
    const body = await req.json()
    const { name, description, fileName, fileUrl, ownerId, visibility } = body
    try {
        const dataset = await prisma.dataset.create({
            data: {
                name,
                description,
                fileName,
                fileUrl,
                ownerId,
                visibility, // e.g. "PRIVATE" or "PUBLIC"
                // teamId: null,
              },
        }) 
        return NextResponse.json(dataset, { status: 201 })       
    } catch (error) {
        console.error('Create dataset error:', error)
        return NextResponse.json({ error: 'Failed to create dataset' }, { status: 500 })
    }
}

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
      })

    const userId = session?.user?.id
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
  
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
  
    const datasets = await prisma.dataset.findMany({
      where: { ownerId: user.id }, // Filter to current user's datasets
      include: {
        owner: true,
        team: true,
        _count: {
          select: { visualizations: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  
    const formatted = datasets.map(ds => ({
      id: ds.id,
      name: ds.name,
      description: ds.description,
      createdAt: ds.createdAt.toISOString(),
      team: ds.team?.name ?? "",
      visibility: ds.visibility,
      visualizations: ds._count.visualizations,
      owner: ds.owner.name,
    }))
  
    return NextResponse.json(formatted)
  }

