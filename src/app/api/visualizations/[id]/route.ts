import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const {id} = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing visualization ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { title, description, type, config } = body;

    if (!title || !type || !config) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedVisualization = await prisma.visualization.update({
      where: { id: id },
      data: {
        title,
        description: description || '',
        type,
        config,
      },
    });

    return NextResponse.json(updatedVisualization, { status: 200 });
  } catch (error) {
    console.error('Error updating visualization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
