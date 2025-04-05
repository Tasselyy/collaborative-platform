import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth' // Your Better Auth instance
import { PrismaClient, TeamRole } from '@prisma/client'
import { headers } from 'next/headers'

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

    // Get session on the server securely
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const creatorId = session.user.id
    const memberIds = body.memberIds?.filter(id => id !== creatorId) || []

    const newTeam = await prisma.team.create({
      data: {
        name: body.name,
        members: {
          create: [
            {
              userId: creatorId,
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
    })

    return NextResponse.json(newTeam, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
// export async function GET(request: NextRequest) {
//   try {
//     // Get the team ID from the URL query parameters
//     const url = new URL(request.url)
//     const teamId = url.searchParams.get('teamId')
    
//     if (!teamId) {
//       return NextResponse.json({ error: 'Team ID is required' }, { status: 400 })
//     }

//     // Get session on the server securely
//     const session = await auth.api.getSession({ headers: await headers() })

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     // Check if the user is a member of the team
//     const userTeamMembership = await prisma.teamMember.findFirst({
//       where: {
//         teamId: teamId,
//         userId: session.user.id
//       }
//     })

//     if (!userTeamMembership) {
//       return NextResponse.json({ error: 'You do not have access to this team' }, { status: 403 })
//     }

//     // Fetch the team with members
//     const team = await prisma.team.findUnique({
//       where: {
//         id: teamId
//       },
//       include: {
//         members: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 image: true
//               }
//             }
//           }
//         }
//       }
//     })

//     if (!team) {
//       return NextResponse.json({ error: 'Team not found' }, { status: 404 })
//     }

//     return NextResponse.json(team, { status: 200 })
//   } catch (error) {
//     console.error('Error fetching team:', error)
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//   }
// }