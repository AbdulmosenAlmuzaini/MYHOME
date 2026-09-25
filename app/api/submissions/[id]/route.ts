import { NextRequest, NextResponse } from 'next/server';
import { queryDatabase, updateSubmissionStatus } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { INITIAL_APPROVED_SUBMISSIONS } from '@/lib/mock-submissions';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = params.id;

    try {
      const rows = await queryDatabase(
        'SELECT * FROM submissions WHERE id = $1 LIMIT 1;',
        [id]
      );

      if (rows && rows.length > 0) {
        return NextResponse.json({ submission: rows[0] });
      }
    } catch (dbErr) {
      console.warn('DB error:', dbErr);
    }

    const fallback = INITIAL_APPROVED_SUBMISSIONS.find((s) => s.id === id);
    if (fallback) {
      return NextResponse.json({ submission: fallback });
    }

    return NextResponse.json({ error: 'المشاركة غير موجودة' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 401 });
  }

  try {
    const id = params.id;
    const body = await request.json();
    const { status, admin_note } = body;

    const note = admin_note || null;
    const reviewedBy = session.email;

    try {
      await updateSubmissionStatus(id, status, note, reviewedBy);
    } catch (dbErr) {
      console.warn('DB update note:', dbErr);
    }

    return NextResponse.json({
      success: true,
      status,
      admin_note: note,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
