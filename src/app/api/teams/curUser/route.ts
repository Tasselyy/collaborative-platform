// app/api/teams/curUser/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'

const prisma = new PrismaClient()

// Get all teams for the current user
export async function GET(request: NextRequest) {
  try {
    // Get session on the server securely
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch all teams where the user is a member
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
    })

    // Transform the data to a more frontend-friendly format
    const teams = userTeams.map(membership => ({
      id: membership.team.id,
      name: membership.team.name,
      description: membership.team.description,
      role: membership.role,
      joinedAt: membership.joinedAt
    }))

    return NextResponse.json({ teams }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user teams:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}