import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
	try {
	  const { id } = await params;
  
	  if (!id) {
		return NextResponse.json(
		  { error: 'Missing datasetId in params' },
		  { status: 400 }
		);
	  }
	  console.log(id)
	  const visualizations = await prisma.visualization.findMany({
		where: {
		  datasetId: id,
		},
		orderBy: {
		  createdAt: 'desc',
		},
	  });
	  console.log(visualizations)
	  return NextResponse.json(visualizations, { status: 200 });
	} catch (error) {
	  console.error('Error loading visualizations:', error);
	  return NextResponse.json(
		{ error: 'Failed to fetch visualizations' },
		{ status: 500 }
	  );
	}
  }