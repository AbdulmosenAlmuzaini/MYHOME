import { sql } from '@vercel/postgres';

export async function ensureDatabaseTables() {
  try {
    // Enable uuid extension if available
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
  } catch {
    // Ignore if permission not granted
  }

  try {
    // Create submissions table for Vercel Postgres
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(64) PRIMARY KEY,
        student_name TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'أخرى',
        file_url TEXT,
        file_path TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        reviewed_at TIMESTAMP WITH TIME ZONE,
        reviewed_by TEXT,
        admin_note TEXT
      );
    `;

    // Create index on status
    await sql`CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);`;
  } catch (err) {
    console.error('Error ensuring database tables:', err);
  }
}

export { sql };
