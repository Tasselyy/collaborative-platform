// app/api/teams/curUser/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '@/lib/services/auth.service'
import { getUserTeams } from '@/lib/services/team.service'
const prisma = new PrismaClient()

// Get all teams for the current user
export async function GET(request: NextRequest) {
  try {
    // Check authentication using the service
    const authResult = await requireAuth(request.headers)
    if (!authResult.success) {
      return authResult.error
    }
    const userId = authResult.userId
    const teams = await getUserTeams(authResult.userId);
    return NextResponse.json({ teams }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user teams:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}