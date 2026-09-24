-- ==============================================================================
-- مبادرة كيمياء وطن أخضر - مخطط قاعدة البيانات في Supabase
-- Kimia Watan Akhdar - Supabase Database Schema & Storage Setup
-- ==============================================================================

-- 1. تمكين امتداد UUID إن لم يكن مفعلاً
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. إنشاء جدول المشاركات (submissions)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'أخرى',
    file_url TEXT,
    file_path TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_edit')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_note TEXT
);

-- 3. إنشاء الفهارس لتحسين سرعة الاستعلامات
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_category ON public.submissions(category);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at DESC);

-- 4. تفعيل أمان مستوى الصفوف (Row Level Security - RLS)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 5. سياسات الوصول (RLS Policies):

-- سياسة 1: السماح لجميع الزوار (الطالبات) بإرسال مشاركة جديدة بحالة pending فقط
DROP POLICY IF EXISTS "Public can submit pending entries" ON public.submissions;
CREATE POLICY "Public can submit pending entries" 
ON public.submissions 
FOR INSERT 
TO public 
WITH CHECK (
    status = 'pending' AND 
    student_name IS NOT NULL AND 
    title IS NOT NULL AND 
    description IS NOT NULL
);

-- سياسة 2: السماح للجميع (المعرض العام) بقراءة المشاركات المعتمدة فقط
DROP POLICY IF EXISTS "Public can read approved submissions" ON public.submissions;
CREATE POLICY "Public can read approved submissions" 
ON public.submissions 
FOR SELECT 
TO public 
USING (status = 'approved');

-- سياسة 3: المشرفات المسجلات (Authenticated Admins) يمكنهن قراءة جميع المشاركات
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.submissions;
CREATE POLICY "Admins can view all submissions" 
ON public.submissions 
FOR SELECT 
TO authenticated 
USING (true);

-- سياسة 4: المشرفات المسجلات يمكنهن تحديث حالة المشاركات وكتابة الملاحظات
DROP POLICY IF EXISTS "Admins can update submissions" ON public.submissions;
CREATE POLICY "Admins can update submissions" 
ON public.submissions 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- سياسة 5: المشرفات المسجلات يمكنهن حذف المشاركات عند الحاجة
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.submissions;
CREATE POLICY "Admins can delete submissions" 
ON public.submissions 
FOR DELETE 
TO authenticated 
USING (true);

-- ==============================================================================
-- إعداد مساحة تخزين الملفات (Supabase Storage Bucket)
-- ==============================================================================

-- إنشاء حزمة التخزين submissions إن لم تكن موجودة وجعلها عامة للقراءة
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'submissions',
    'submissions',
    true,
    5242880, -- حد أقصى 5 ميغابايت
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];

-- سياسات تخزين الملفات (Storage Policies)

-- سياسة رفع الملفات للجميع
DROP POLICY IF EXISTS "Allow public uploads to submissions bucket" ON storage.objects;
CREATE POLICY "Allow public uploads to submissions bucket"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'submissions');

-- سياسة قراءة الملفات للجميع
DROP POLICY IF EXISTS "Allow public download from submissions bucket" ON storage.objects;
CREATE POLICY "Allow public download from submissions bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'submissions');

-- سياسة إدارة وحذف الملفات للمشرفات المسجلات فقط
DROP POLICY IF EXISTS "Allow authenticated admins to manage storage" ON storage.objects;
CREATE POLICY "Allow authenticated admins to manage storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'submissions')
WITH CHECK (bucket_id = 'submissions');
