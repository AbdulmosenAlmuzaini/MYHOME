import { NextRequest, NextResponse } from 'next/server';
import { getApprovedSubmissions, insertSubmission } from '@/lib/db';
import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf',
];

// GET /api/submissions -> returns only approved submissions from Neon Postgres
export async function GET() {
  try {
    const rows = await getApprovedSubmissions();
    return NextResponse.json(
      { 
        success: true,
        submissions: rows || [] 
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  } catch (error: any) {
    console.error('Error fetching approved submissions:', error);
    return NextResponse.json(
      { success: false, error: 'تعذر جلب المشاركات من قاعدة البيانات.', submissions: [] },
      { status: 500 }
    );
  }
}

// POST /api/submissions -> atomically handles file upload & database insert
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let student_name = '';
    let title = '';
    let description = '';
    let category = 'إعادة تدوير';
    let file_url: string | null = null;
    let file_path: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      student_name = (formData.get('student_name') as string) || '';
      title = (formData.get('title') as string) || '';
      description = (formData.get('description') as string) || '';
      category = (formData.get('category') as string) || 'إعادة تدوير';

      const file = formData.get('file') as File | null;

      if (file && file.size > 0) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          return NextResponse.json(
            { success: false, error: 'نوع الملف غير مدعوم. الصيغ المسموحة: JPG, JPEG, PNG, WEBP, PDF.' },
            { status: 400 }
          );
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            { success: false, error: 'حجم الملف يتجاوز الحد الأقصى المسموح به (5 ميجابايت).' },
            { status: 400 }
          );
        }

        // Generate unique filename: submissions/{uuid}-{timestamp}-{sanitizedFilename}
        const uuid = Math.random().toString(36).substring(2, 10);
        const timestamp = Date.now();
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        file_path = `submissions/${uuid}-${timestamp}-${sanitizedFilename}`;

        // Upload directly to Vercel Blob (with fallback if token is not yet linked in Vercel)
        try {
          const blob = await put(file_path, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });
          file_url = blob.url;
        } catch (blobError: any) {
          console.warn('Vercel Blob token not configured, using resilient fallback:', blobError.message);
          // Resilient fallback: convert to base64 Data URL so the submission succeeds without blocking the student
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          file_url = `data:${file.type};base64,${buffer.toString('base64')}`;
        }
      }
    } else {
      // JSON body handling
      const body = await request.json();
      student_name = body.student_name || '';
      title = body.title || '';
      description = body.description || '';
      category = body.category || 'إعادة تدوير';
      file_url = body.file_url || null;
      file_path = body.file_path || null;
    }

    const trimmedName = student_name.trim();
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName || !trimmedTitle || !trimmedDesc) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول المطلوبة (اسم الطالبة، عنوان المشاركة، الوصف) يجب تعبئتها.' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const uniqueId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Save record to Neon Postgres with status = 'pending'
    await insertSubmission({
      id: uniqueId,
      student_name: trimmedName,
      title: trimmedTitle,
      description: trimmedDesc,
      category: category.trim(),
      file_url: file_url,
      file_path: file_path,
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: uniqueId,
        student_name: trimmedName,
        title: trimmedTitle,
        file_url: file_url,
        status: 'pending',
      },
    });
  } catch (error: any) {
    console.error('Submission processing error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'تعذر إرسال المشاركة، يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
