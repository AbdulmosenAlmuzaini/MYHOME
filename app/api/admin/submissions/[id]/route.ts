import { NextRequest, NextResponse } from 'next/server';
import { queryDatabase, updateSubmissionStatus } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/admin/submissions/:id -> gets details of a submission
export async function GET(request: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح بالوصول.' }, { status: 401 });
  }

  try {
    const id = params.id;
    const rows = await queryDatabase('SELECT * FROM submissions WHERE id = $1 LIMIT 1;', [id]);

    if (rows && rows.length > 0) {
      return NextResponse.json({ submission: rows[0] });
    }

    return NextResponse.json({ error: 'المشاركة غير موجودة في قاعدة البيانات.' }, { status: 404 });
  } catch (error: any) {
    console.error('Error fetching submission detail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/submissions/:id -> updates status, admin_note, reviewed_at
export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح بالوصول.' }, { status: 401 });
  }

  try {
    const id = params.id;
    const body = await request.json();
    const { status, admin_note } = body;

    const allowedStatuses = ['pending', 'approved', 'rejected', 'needs_edit'];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'الحالة المحددة غير صالحة.' }, { status: 400 });
    }

    const note = admin_note?.trim() || null;
    await updateSubmissionStatus(id, status, note, session.email);

    return NextResponse.json({
      success: true,
      id,
      status,
      admin_note: note,
    });
  } catch (error: any) {
    console.error('Error updating submission status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
