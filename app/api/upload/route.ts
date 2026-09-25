import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال أي ملف' }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to Vercel Blob
    try {
      const blob = await put(`submissions/${filename}`, file, {
        access: 'public',
      });

      return NextResponse.json({
        url: blob.url,
        pathname: blob.pathname,
      });
    } catch (blobError: any) {
      console.warn('Vercel Blob upload fallback:', blobError.message);
      
      // Fallback: If Vercel Blob token is not configured locally, convert to Base64 data URL
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      return NextResponse.json({
        url: base64,
        pathname: `local/${filename}`,
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 });
  }
}
