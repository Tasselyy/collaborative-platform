import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';
import { getSignedFileUrl } from '@/lib/s3';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await uploadToS3(
      buffer,
      file.name,
      file.type || 'application/octet-stream'
    );
    //obtasin acutal cloud file url with signedFileUrl
    const signedUrl = await getSignedFileUrl(file.name);
    return NextResponse.json({ url: signedUrl });
  } catch (err) {
    console.error('[Upload Error]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
