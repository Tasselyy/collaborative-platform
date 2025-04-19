import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth" 
import { headers } from "next/headers"

export async function GET(request: NextRequest) {
    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.id;
  
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    const userId = request.nextUrl.searchParams.get('ownerId');

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { teams: true }, 
      });
  
      const teamIds = user?.teams.map(team => team.id) || [];
  
      const datasets = await prisma.dataset.findMany({
        where: {
          OR: [
            { ownerId: userId }, 
            { visibility: 'PUBLIC' }, 
            {
              visibility: 'TEAM',
              teamId: { in: teamIds }
            }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
  
      return NextResponse.json(datasets);
    } catch (error) {
      console.error('Error fetching datasets:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }