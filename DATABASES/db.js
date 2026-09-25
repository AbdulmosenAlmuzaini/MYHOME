import { Pool } from '@neondatabase/serverless';

const connectionString = 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_URL_NON_POOLING || 
  '';

export async function queryDatabase(queryText, params = []) {
  if (!connectionString) {
    console.warn('DATABASE_URL is not defined in environment variables.');
    return [];
  }
  try {
    const pool = new Pool({ connectionString });
    const res = await pool.query(queryText, params);
    return res.rows || [];
  } catch (err) {
    console.error('Database query error:', err);
    return [];
  }
}

export async function ensureDatabaseTables() {
  if (!connectionString) return;

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(64) PRIMARY KEY,
        student_name VARCHAR(150) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        file_url TEXT,
        file_path TEXT,
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP NULL,
        admin_note TEXT NULL
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

export async function getApprovedSubmissions() {
  await ensureDatabaseTables();
  const query = `
    SELECT * FROM submissions 
    WHERE status = 'approved' 
    ORDER BY created_at DESC;
  `;
  return queryDatabase(query);
}

export async function getAllSubmissions() {
  await ensureDatabaseTables();
  const query = `
    SELECT * FROM submissions 
    ORDER BY created_at DESC;
  `;
  return queryDatabase(query);
}

export async function insertSubmission({ id, student_name, title, description, category, file_url, file_path }) {
  await ensureDatabaseTables();
  const query = `
    INSERT INTO submissions (id, student_name, title, description, category, file_url, file_path, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', CURRENT_TIMESTAMP)
    RETURNING *;
  `;
  return queryDatabase(query, [
    id,
    student_name,
    title,
    description,
    category,
    file_url,
    file_path,
  ]);
}

export async function updateSubmissionStatus(id, status, admin_note, reviewed_by = '') {
  await ensureDatabaseTables();
  const query = `
    UPDATE submissions 
    SET status = $1, 
        admin_note = $2, 
        reviewed_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *;
  `;
  return queryDatabase(query, [status, admin_note, id]);
}
