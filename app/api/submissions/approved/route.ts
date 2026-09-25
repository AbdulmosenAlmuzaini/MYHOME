import { NextResponse } from 'next/server';
import { getApprovedSubmissions } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/submissions/approved -> Returns ONLY status = 'approved' from Neon Postgres
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
  } catch (error) {
    console.error('Error fetching approved submissions:', error);
    return NextResponse.json({ success: false, submissions: [] }, { status: 500 });
  }
}

