import { Pool } from '@neondatabase/serverless';
import { sql as vercelSql } from '@vercel/postgres';

const connectionString = 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL_NON_POOLING || 
  '';

export async function queryDatabase(queryText: string, params: any[] = []): Promise<any[]> {
  try {
    if (connectionString) {
      const pool = new Pool({ connectionString });
      const res = await pool.query(queryText, params);
      return res.rows || [];
    }
    const res = await vercelSql.query(queryText, params);
    return res.rows || [];
  } catch (err) {
    console.error('Database query error:', err);
    return [];
  }
}

export async function ensureDatabaseTables() {
  const isConfigured = Boolean(
    process.env.POSTGRES_URL || 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL_NON_POOLING
  );

  if (!isConfigured) {
    return;
  }

  try {
    const createTableQuery = `
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
    await queryDatabase(createTableQuery);

    const createIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
    `;
    await queryDatabase(createIndexQuery);
  } catch (err) {
    console.error('Error ensuring database tables:', err);
  }
}

export async function getSubmissions(onlyApproved = true): Promise<any[]> {
  await ensureDatabaseTables();
  const query = onlyApproved
    ? `SELECT * FROM submissions WHERE status = 'approved' ORDER BY created_at DESC;`
    : `SELECT * FROM submissions ORDER BY created_at DESC;`;
  
  return queryDatabase(query);
}

export async function insertSubmission(sub: {
  id: string;
  student_name: string;
  title: string;
  description: string;
  category: string;
  file_url: string | null;
  file_path: string | null;
}): Promise<any[]> {
  await ensureDatabaseTables();
  const query = `
    INSERT INTO submissions (id, student_name, title, description, category, file_url, file_path, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())
    RETURNING *;
  `;
  return queryDatabase(query, [
    sub.id,
    sub.student_name,
    sub.title,
    sub.description,
    sub.category,
    sub.file_url,
    sub.file_path,
  ]);
}

export async function updateSubmissionStatus(
  id: string, 
  status: string, 
  adminNote: string | null, 
  reviewedBy: string
): Promise<any[]> {
  await ensureDatabaseTables();
  const query = `
    UPDATE submissions 
    SET status = $1, 
        admin_note = $2, 
        reviewed_at = NOW(), 
        reviewed_by = $3
    WHERE id = $4
    RETURNING *;
  `;
  return queryDatabase(query, [status, adminNote, reviewedBy, id]);
}
