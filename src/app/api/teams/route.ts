import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, TeamRole } from '@prisma/client'
import { createTeam } from '@/lib/services/team.service'
import { requireAuth } from '@/lib/services/auth.service'
const prisma = new PrismaClient()

type CreateTeamRequest = {
  name: string
  memberIds?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTeamRequest = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
    }

    // Use auth service to check authentication
    const authResult = await requireAuth(request.headers)
    if (!authResult.success) {
      return authResult.error
    }

    const creatorId = authResult.userId
    const memberIds = body.memberIds?.filter(id => id !== creatorId) || []
    const newTeam = await createTeam(body.name, creatorId, memberIds);
    return NextResponse.json(newTeam, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}