// app/api/visualizations/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const visualization = await prisma.visualization.findUnique({
        where: { id: params.id },
    });
    if (!visualization) {
        return NextResponse.json(
            { error: 'Visualization not found' },
            { status: 404 }
        );
    }
    return NextResponse.json(visualization);
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { title, type, config } = body;
    try {
        const updatedVisualization = await prisma.visualization.update({
            where: { id: params.id },
            data: { title, type, config },
        });
        return NextResponse.json(updatedVisualization);
    } catch (error) {
        console.error('Error updating visualization:', error);
        return NextResponse.json(
            { error: 'Failed to update visualization' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const deletedVisualization = await prisma.visualization.delete({
            where: { id: params.id },
        });
        return NextResponse.json(deletedVisualization);
    } catch (error) {
        console.error('Error deleting visualization:', error);
        return NextResponse.json(
            { error: 'Failed to delete visualization' },
            { status: 500 }
        );
    }
}
