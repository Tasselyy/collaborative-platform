import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const s3Url = await uploadToS3(
      buffer,
      file.name,
      file.type || 'application/octet-stream'
    );

    return NextResponse.json({ url: s3Url });
  } catch (err) {
    console.error('[Upload Error]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
