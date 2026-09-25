import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions, insertSubmission } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { INITIAL_APPROVED_SUBMISSIONS } from '@/lib/mock-submissions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedAll = searchParams.get('all') === 'true';

  try {
    const session = await getAdminSession();
    const onlyApproved = !(requestedAll && session);

    const rows = await getSubmissions(onlyApproved);
    const data = rows && rows.length > 0 ? rows : INITIAL_APPROVED_SUBMISSIONS;

    return NextResponse.json({ submissions: data });
  } catch (error) {
    console.warn('Postgres query fallback:', error);
    return NextResponse.json({ submissions: INITIAL_APPROVED_SUBMISSIONS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_name, title, description, category, file_url, file_path } = body;

    if (!student_name || !title || !description) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب تعبئتها' },
        { status: 400 }
      );
    }

    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const cat = category || 'أخرى';
    const fUrl = file_url || null;
    const fPath = file_path || null;

    try {
      await insertSubmission({
        id,
        student_name,
        title,
        description,
        category: cat,
        file_url: fUrl,
        file_path: fPath,
      });
    } catch (dbErr) {
      console.warn('Database insert note:', dbErr);
    }

    return NextResponse.json({
      success: true,
      submission: {
        id,
        student_name,
        title,
        description,
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
      { error: 'حدث خطأ أثناء حفظ المشاركة' },
      { status: 500 }
    );
  }
}
