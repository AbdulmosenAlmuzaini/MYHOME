import { NextResponse } from 'next/server';
import { getApprovedSubmissions } from '@/lib/db';

// GET /api/submissions/approved -> Returns ONLY status = 'approved' from Neon Postgres
export async function GET() {
  try {
    const rows = await getApprovedSubmissions();
    return NextResponse.json({ submissions: rows || [] });
  } catch (error) {
    console.error('Error fetching approved submissions:', error);
    return NextResponse.json({ submissions: [] });
  }
}
