import { NextRequest, NextResponse } from 'next/server';
import { getApprovedSubmissions, insertSubmission } from '@/lib/db';

// GET /api/submissions -> returns only approved submissions from Neon Postgres
export async function GET() {
  try {
    const rows = await getApprovedSubmissions();
    return NextResponse.json({ submissions: rows || [] });
  } catch (error) {
    console.error('Error fetching approved submissions:', error);
    return NextResponse.json({ submissions: [] });
  }
}

// POST /api/submissions -> receives new submission, validates, and saves as pending in Neon Postgres
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_name, title, description, category, file_url, file_path } = body;

    const trimmedName = student_name?.trim();
    const trimmedTitle = title?.trim();
    const trimmedDesc = description?.trim();

    if (!trimmedName || !trimmedTitle || !trimmedDesc) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة (اسم الطالبة، عنوان المشاركة، الوصف) يجب تعبئتها.' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const uniqueId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const cat = category?.trim() || 'أخرى';
    const fUrl = file_url || null;
    const fPath = file_path || null;

    // Server-enforced status = 'pending'
    const result = await insertSubmission({
      id: uniqueId,
      student_name: trimmedName,
      title: trimmedTitle,
      description: trimmedDesc,
      category: cat,
      file_url: fUrl,
      file_path: fPath,
    });

    return NextResponse.json({
      success: true,
      message: 'تم استلام المشاركة بنجاح وحفظها بحالة قيد المراجعة.',
      submission: {
        id: uniqueId,
        student_name: trimmedName,
        title: trimmedTitle,
        description: trimmedDesc,
        category: cat,
        file_url: fUrl,
        file_path: fPath,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حفظ المشاركة في قاعدة البيانات.' },
      { status: 500 }
    );
  }
}
