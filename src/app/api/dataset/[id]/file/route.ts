import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const {id} = await params;

  try {
    const dataset = await prisma.dataset.findUnique({
      where: { id: id},
    });

    if (!dataset || !dataset.fileUrl || !dataset.fileName) {
      return NextResponse.json(
        { error: 'Dataset not found or invalid' },
        { status: 404 }
      );
    }

    const fileExt = dataset.fileName.split('.').pop()?.toLowerCase();
    const mimeType = {
      csv: 'text/csv',
      json: 'application/json',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xls: 'application/vnd.ms-excel',
    }[fileExt || ''] || 'application/octet-stream';

    let fileBuffer: Buffer | ArrayBuffer;
    const isRemote =
      dataset.fileUrl.startsWith('http://') ||
      dataset.fileUrl.startsWith('https://');

    if (isRemote) {
      const response = await fetch(dataset.fileUrl, {
        method: 'GET',
        // Optional: timeout could be handled with AbortController
      });
      if (!response.ok) {
        throw new Error('Failed to fetch file from S3 or remote URL');
      }

      fileBuffer = await response.arrayBuffer();
    } else {
      const resolvedPath = path.isAbsolute(dataset.fileUrl)
        ? dataset.fileUrl
        : path.resolve(process.cwd(), dataset.fileUrl);

      fileBuffer = await fs.readFile(resolvedPath);
    }

    return new NextResponse(fileBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${dataset.fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error fetching dataset file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
