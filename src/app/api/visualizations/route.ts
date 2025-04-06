import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// --- Create new visualization ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, type, config, datasetId } = body;

    if (!title || !type || !config || !datasetId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newVisualization = await prisma.visualization.create({
      data: {
        title,
        description: description || '',
        type,
        config,
        datasetId,
      },
    });

    return NextResponse.json(newVisualization, { status: 201 });
  } catch (error) {
    console.error('Error saving visualization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


