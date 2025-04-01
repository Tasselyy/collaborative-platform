import { NextResponse } from 'next/server';
import { getSignedFileUrl } from '@/lib/s3'; 

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    const signedUrl = await getSignedFileUrl(filename);
    return NextResponse.json({ url: signedUrl });
  } catch (err) {
    console.error('[Signed URL Error]', err);
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
  }
}
