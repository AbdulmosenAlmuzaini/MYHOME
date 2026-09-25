import { NextRequest, NextResponse } from 'next/server';
import { sql, ensureDatabaseTables } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { INITIAL_APPROVED_SUBMISSIONS } from '@/lib/mock-submissions';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await ensureDatabaseTables();
    const id = params.id;

    try {
      const result = await sql`
        SELECT * FROM submissions WHERE id = ${id} LIMIT 1;
      `;

      if (result.rows.length > 0) {
        return NextResponse.json({ submission: result.rows[0] });
      }
    } catch (dbErr) {
      console.warn('DB error:', dbErr);
    }

    // Fallback to initial mock if not in DB
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
    await ensureDatabaseTables();
    const id = params.id;
    const body = await request.json();
    const { status, admin_note } = body;

    const note = admin_note || null;
    const reviewedBy = session.email;

    try {
      await sql`
        UPDATE submissions 
        SET status = ${status}, 
            admin_note = ${note}, 
            reviewed_at = NOW(), 
            reviewed_by = ${reviewedBy}
        WHERE id = ${id};
      `;
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
