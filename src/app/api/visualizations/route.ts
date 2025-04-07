// app/api/visualizations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const datasetId = searchParams.get('datasetId');

    let visualizations;
    if (datasetId) {
        visualizations = await prisma.visualization.findMany({
            where: { datasetId },
            orderBy: { createdAt: 'desc' },
        });
    } else {
        visualizations = await prisma.visualization.findMany({
            where: { dataset: { ownerId: session.user.id } },
            orderBy: { createdAt: 'desc' },
        });
    }
    return NextResponse.json(visualizations);
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { title, type, config, datasetId } = body;
    if (!title || !type || !config || !datasetId) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }
    try {
        const visualization = await prisma.visualization.create({
            data: {
                title,
                type,
                config,
                datasetId,
            },
        });
        return NextResponse.json(visualization, { status: 201 });
    } catch (error) {
        console.error('Error creating visualization:', error);
        return NextResponse.json(
            { error: 'Failed to create visualization' },
            { status: 500 }
        );
    }
}
