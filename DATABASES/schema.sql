-- ==============================================================================
-- مبادرة كيمياء وطن أخضر - مخطط جدول المشاركات في Neon Postgres (Vercel)
-- Kimia Watan Akhdar - Neon Postgres Database Schema
-- ==============================================================================

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

-- إنشاء الفهارس لتحسين سرعة الاستعلامات والفرز
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_category ON submissions(category);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
