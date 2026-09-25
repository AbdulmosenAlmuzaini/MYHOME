# 🗄️ إعداد قاعدة بيانات Neon Postgres لمبادرة كيمياء وطن أخضر

## 1. ما هي قاعدة البيانات المستخدمة؟
يستخدم المشروع **Neon Postgres** من متجر Vercel Marketplace (`@neondatabase/serverless`).

## 2. كيفية إنشاء وربط قاعدة البيانات في Vercel:
1. ادخل إلى مشروعك في لوحة تحكم Vercel.
2. اذهب إلى تبويب **Storage**.
3. اضغط على **Create Database** أو **Browse Storage**.
4. اختر **Neon (Serverless Postgres)**.
5. اضغط **Continue** ثم **Connect to Project**.
6. سيتم توليد متغير البيئة `DATABASE_URL` تلقائياً.

## 3. هيكل جدول المشاركات (`submissions`):
* `id`: معرّف فريد للمشاركة (VARCHAR/UUID).
* `student_name`: اسم الطالبة (VARCHAR 150 - إلزامي).
* `title`: عنوان المشاركة (VARCHAR 200 - إلزامي).
* `description`: وصف العمل والمبادرة (TEXT - إلزامي).
* `category`: نوع المشاركة (VARCHAR 100 - إلزامي).
* `file_url`: رابط الصورة أو ملف التوثيق المرفوع إلى Vercel Blob.
* `file_path`: مسار الملف المخزن.
* `status`: حالة المشاركة (`pending`، `approved`، `rejected`، `needs_edit`).
* `created_at`: تاريخ ووقت إرسال المشاركة.
* `reviewed_at`: تاريخ مراجعة واعتماد المشرفة للمشاركة.
* `admin_note`: ملاحظة المشرفة (في حالة طلب التعديل أو التوجيه).

## 4. ملف الـ Schema:
ملف `DATABASES/schema.sql` يحتوي على أوامر إنشاء الجدول والفهارس.
*(يقوم السيرفر بإنشاء الجدول ذاتياً وبشكل تلقائي عند أول عملية استعلام).*
