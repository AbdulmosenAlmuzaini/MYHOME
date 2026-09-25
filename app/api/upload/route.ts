import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرفاق أي ملف.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. الصيغ المدعومة هي JPG, JPEG, PNG, WEBP, PDF فقط.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'حجم الملف يتجاوز الحد الأقصى المسموح به (5 ميجابايت).' },
        { status: 400 }
      );
    }

    // Generate unique filename: submissions/UUID-timestamp-filename.ext
    const uuid = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `submissions/${uuid}-${timestamp}-${sanitizedName}`;

    // Upload to Vercel Blob using BLOB_READ_WRITE_TOKEN
    try {
      const blob = await put(filename, file, {
        access: 'public',
      });

      return NextResponse.json({
        url: blob.url,
        pathname: blob.pathname,
      });
    } catch (blobError: any) {
      console.warn('Vercel Blob upload warning:', blobError.message);
      
      // Fallback: If Vercel Blob token is pending, store as base64 data url safely
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      return NextResponse.json({
        url: base64,
        pathname: filename,
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'فشل رفع الملف إلى مساحة التخزين.' }, { status: 500 });
  }
}
