# 🌱 كيمياء وطن أخضر
### كيمياء اليوم… استدامة الغد 🌱

مبادرة تعليمية تفاعلية باللغة العربية موجهة لطالبات المرحلة الثانوية، تربط بين الكيمياء والاستدامة والجهود الوطنية للمملكة في المحافظة على البيئة والموارد الطبيعية.

---

## 👥 فريق العمل والإشراف

* **إعداد المعلمتين:** جميلة الصاعدي ، صباح الأحمدي
* **مديرة الثانوية السادسة والثلاثون:** زينب الأمين

---

## 🛠️ التقنيات المستخدمة

* **Next.js 14** (App Router & Server/Client Components)
* **TypeScript**
* **Tailwind CSS** (تصميم وهوية وطنية متقدمة مع RTL وDark Emerald & Gold)
* **Google Font Cairo** للخط العربي
* **Supabase Database & Auth & Storage**
* **Canvas Confetti & Lucide React Icons**
* **Print CSS** مخصص لطباعة ميثاق الاستدامة A4

---

## 🚀 دليل الإعداد والتشغيل السريع (10 خطوات من الصفر إلى Vercel)

### 1. إنشاء مشروع Supabase
1. ادخلي إلى [Supabase](https://supabase.com) وسجلي الدخول.
2. انقري على **New Project** وأنشئي مشروعاً جديداً وحددي اسم المشروع وكلمة مرور قاعدة البيانات والمنطقة (مثلاً: Middle East / Frankfurt).

### 2. تشغيل SQL لإنشاء قاعدة البيانات
1. من القائمة الجانبية في Supabase Dashboard، ادخلي إلى **SQL Editor**.
2. افتحي ملف `supabase/schema.sql` الموجود في هذا المشروع، وانسخي محتواه بالكامل.
3. الصقيه في محرر SQL في Supabase ثم اضغطي **Run**.
4. سيتم تلقائياً إنشاء جدول `submissions`، وتفعيل حماية الأسطر `RLS`، وإعداد السياسات الأمنية والفهارس.

### 3. إعداد مساحة تخزين الملفات (Storage Bucket)
* تم تضمين كود إنشاء حزمة التخزين `submissions` تلقائياً داخل ملف SQL مع السياسات الأمنية للرفع والعرض.
* يمكنكِ التأكد بالذهاب إلى **Storage** في Supabase والتأكد من وجود Bucket باسم `submissions` بحالة Public.

### 4. إنشاء حسابات المعلمات المشرفات
1. في Supabase Dashboard، اذهبي إلى **Authentication** -> **Users**.
2. اضغطي على **Add user** -> **Create user**.
3. أضيفي البريد الإلكتروني وكلمة المرور الخاصة بالمعلمتين المشرفتين (جميلة الصاعدي / صباح الأحمدي).

### 5. إعداد ملف المتغيرات البيئية (`.env.local`)
1. في Supabase Dashboard، اذهبي إلى **Project Settings** -> **API**.
2. انسخي **Project URL** و **anon public key**.
3. افتحي ملف `.env.local` في المشروع وضعي القيم:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. تشغيل المشروع محلياً
لتشغيل بيئة التطوير على جهازك:
```bash
npm install
npm run dev
```
افتحي المتصفح على: `http://localhost:3000`

---

## 🌐 النشر على Vercel

### 7. رفع المشروع إلى مستودع GitHub
```bash
git init
git add .
git commit -m "Initial commit for Kimia Watan Akhdar"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kimia-watan-akhdar.git
git push -u origin main
```

### 8. ربط المستودع بـ Vercel
1. ادخلي إلى [Vercel Dashboard](https://vercel.com).
2. اضغطي **Add New...** -> **Project**.
3. اختاري مستودع GitHub الخاص بالمشروع (`kimia-watan-akhdar`) واضغطي **Import**.

### 9. إضافة Environment Variables في Vercel
في صفحة الإعداد قبل النشر (أو من **Settings -> Environment Variables** داخل Vercel):
* أضيفي `NEXT_PUBLIC_SUPABASE_URL` مع قيمتها من Supabase.
* أضيفي `NEXT_PUBLIC_SUPABASE_ANON_KEY` مع قيمتها من Supabase.

### 10. النشر (Deploy)
اضغطي **Deploy**. وخلال ثوانٍ معدودة سيكون موقعك جاهزاً ويعمل برابط مباشر وسريع!

---

## 🧭 مسارات وصفحات التطبيق

| المسار | الوصف | الفئة المستهدفة |
| :--- | :--- | :--- |
| `/` | الصفحة الرئيسية (الهيرو، فكرة المبادرة، المحاور السبعة، بطاقات التنقل) | الجميع |
| `/quiz` | التحدي التفاعلي (7 أسئلة مع تغذية راجعة فورية، حفظ الاسم، وشاشة الاحتفال) | الطالبات |
| `/participation` | نموذج رفع المشاركات والأعمال والمبادرات البيئية مع رفع الملفات | الطالبات |
| `/gallery` | معرض المشاركات المعتمدة فقط مع الفلترة حسب المجال والبحث | الجميع |
| `/pledge` | وثيقة ميثاق الاستدامة المخصصة للطباعة A4 والتوقيع الرقمي | الطالبات |
| `/admin/login` | بوابة تسجيل دخول المشرفات عبر بريد وكلمة مرور آمنة | المشرفات |
| `/admin` | لوحة تحكم المشرفة (الإحصائيات، جدول المشاركات، التصفية) | المشرفات |
| `/admin/submissions/[id]` | فحص تفاصيل المشاركة، الاعتماد، طلب التعديل، أو الرفض | المشرفات |

---

«وطننا أمانة… واستدامته مسؤوليتنا» 🇸🇦🌱
