import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id: params.id },
            include: {
                owner: true,
                team: {
                    include: {
                        members: true,
                    },
                },
                visualizations: true, // optionally include visualizations too
            },
        });

        if (!dataset) {
            return NextResponse.json(
                { error: 'Dataset not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(dataset); // returning raw dataset including everything
    } catch (error) {
        console.error('Error fetching dataset by ID:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
