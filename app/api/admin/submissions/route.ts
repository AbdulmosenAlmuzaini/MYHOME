import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

// GET /api/admin/submissions -> returns all submissions (pending, approved, rejected, needs_edit) for supervisors
export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح بالوصول إلى لوحة الإدارة.' }, { status: 401 });
    }

    const rows = await getAllSubmissions();
    return NextResponse.json({ submissions: rows || [] });
  } catch (error: any) {
    console.error('Admin submissions fetch error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب المشاركات.' }, { status: 500 });
  }
}
